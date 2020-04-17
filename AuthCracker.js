function cmd(dir) {
    var p = java.lang.Runtime.getRuntime().exec("su -c \"\"" + dir + "\"\"");
    p.waitFor();
    var r = p.getInputStream() || p.getErrorStream();
    return readInputStream(r);
}
cmd("chmod -R 777 /data/data/com.kakao.talk/shared_prefs")

var readFile = (path) => {
    //read file data from path and return it (str)
    var filedir = new java.io.File(path);
    try {
        var br = new java.io.BufferedReader(new java.io.FileReader(filedir));
        var readStr = "";
        var str = null;
        while (((str = br.readLine()) != null)) {
            readStr += str + "\n";
        }
        br.close();
        return readStr.trim();
    } catch (e) {
        return e;
    }
}

var get_auth_token = () => {
    return readFile("/data/data/com.kakao.talk/shared_prefs/KakaoTalk.authorization.preferences.xml").split("<string name=\"encrypted_auth_token\">")[1].split("</string")[0];
}

var get_device_uuid = () => {
    return readFile("/data/data/com.kakao.talk/shared_prefs/KakaoTalk.hw.perferences.xml").split("<string name=\"deviceUUID\">")[1].split("</string")[0];
}

var get_authorization_suffix = () => {
    var a = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f'];

    var instance = java.security.MessageDigest.getInstance("SHA")
    instance.reset()
    var bytes = java.lang.String.format(java.util.Locale.US, "%s %s", "dkljleskljfeisflssljeif",  get_device_uuid() ).getBytes()
    instance.update(bytes)
    var bArr = instance.digest()

    var stringBuffer = new java.lang.StringBuffer();
    for (var i =0;i<bArr.length;i++) {
        b2 = bArr[i]
        stringBuffer.append(a[(b2 & 240) >> 4]);
        stringBuffer.append(a[b2 & 15]);
    }
    return stringBuffer.toString();
}

var get_authorization_prefix = () => {
    var key1 = [67, 109, -115, -110, -23, 119, 33, 86, -99, -28, -102, 109, -73, 13, 43, -96, 109, -76, 91, -83, 73, -14, 107, -88, 6, 11, 74, 109, 84, -68, -80, 15];
    var key2 = [10, 2, 3, -4, 20, 73, 47, -38, 27, -22, 11, -20, -22, 37, 36, 54]
    var auth_token                  =   get_auth_token()
    var b64_decrypted_auth_token    =   android.util.Base64.decode(auth_token, 0);

    var cipher = new javax.crypto.Cipher.getInstance("AES/CBC/PKCS5PADDING")
    var key = new javax.crypto.spec.SecretKeySpec(key1, "AES")
    var iv = new javax.crypto.spec.IvParameterSpec(key2)
    cipher.init(2,key,iv)
    var final = cipher.doFinal(b64_decrypted_auth_token)
    return JSON.parse(new java.lang.String(final,"UTF-8")).access_token
}

var get_authroization_header = () => {
    return get_authorization_prefix() + "-" + get_authorization_suffix()
}

module.exports.get_authroization_header = get_authroization_header

