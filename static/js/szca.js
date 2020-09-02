
var szcaObj = {};

szcaObj.SZCAOcx = null;

//初始化ca
szcaObj.initCa = function() {
    szcaObj.initCertList();
}

//初始化ca ocx
szcaObj.initOCX = function(){
    if(szcaObj.SZCAOcx != null){
        return;
    }
    var oHead = document.getElementsByTagName('HEAD').item(0);
    var ocx = document.getElementById('SZCAOcx');
    if (!ocx) {
    	ocx = document.createElement("object");
    	ocx.classid = "clsid:31D9C2D1-3BEC-4B25-87D6-16F6C3D75DE6";
    	ocx.id = "SZCAOcx";
    	oHead.appendChild(ocx);
    }
    szcaObj.SZCAOcx = ocx;
    try {
        SZCAOcx.AxSetCertFilterStrP1("SC;SZCA;#;#;#;");
    }catch(ex){
        alert("初始化CA OCX控件失败，请使用IE9或更高版本浏览器，并且确认CA驱动已安装。\n" + ex);
    }
}

//加载CA证书列表
szcaObj.initCertList = function() {
	szcaObj.initOCX();
	var objList = document.getElementById('IECertList');
	if (!objList) {
		var certDiv = '<div style="font-size:16px;display:none;" >证书列表：<select id="IECertList" style="width:200px;"> </select><button id="btnLoadCaList">加载证书列表</button></div>';
		$(document.body).append(certDiv);
		objList = document.getElementById('IECertList');
	}
	SZCAOcx.AxInitAll();
    var certList = SZCAOcx.AxGetCertList();
    var certArray = certList.split(";");
    objList.options.length = 0;
    for (var i = 0; i < certArray.length - 1; i++)
    {
        var certInfo = certArray[i];
        var infoArray = certInfo.split("#");
        if (infoArray.length > 2 && infoArray[2].indexOf('SZCA') > -1) {
            objList.add(new Option(infoArray[0], infoArray[1]));
        }
    }
}

szcaObj.getCertExt = function(){
	try {
        szcaObj.initOCX();
        SZCAOcx.AxInitAll();
        var result = SZCAOcx.AxGetUsbKeyTypeEx();
        if (!result) {
            alert("读取CA失败，确认是否已插入CA");
            return;
        }
        var certList = SZCAOcx.AxGetCertList();
        var certArray = certList.split(";");
        var objList = new Array();
        for (var i = 0; i < certArray.length - 1; i++){
            var certInfo = certArray[i];
            var infoArray = certInfo.split("#");
            if (infoArray.length > 1 && infoArray[2].indexOf('SZCA') > -1) {
                var caObj = {"cn":infoArray[0],"keySeriesNumber":infoArray[1]};
                objList.push(caObj);
            }
        }
        if(objList.length > 1){
            alert('只允许插入一个CA！');
            return;
        }else if(objList.length == 0){
            alert("读取CA失败，确认是否已插入CA");
            return;
        }
        var caObj = objList[0];
        var signData = SZCAOcx.AxSignBySn(caObj.keySeriesNumber, "abcdefg123456");
        var certData = SZCAOcx.AxParseSignedData(signData, 2);
        var oid = SZCAOcx.AxGetCertInfoByOid(certData, "2.16.156.112548");
        var validTime = SZCAOcx.AxGetB64CertInfo(certData, 0x00000036);
        caObj.caKeyId = oid;
        caObj.validTime = validTime;
		return caObj;
	}
	catch(ex)
	{
        alert("请确认CA驱动已安装");
	}
	return;
}

szcaObj.checkPin = function(pin,infoData) {
	var result=szcaObj.SZCAOcx.AxIfKeyExist();
	if(!result)
	{
		alert("读取CA失败，确认是否已插入CA。");
	}
	szcaObj.SZCAOcx.AxSetPin(pin);
	var result = szcaObj.SZCAOcx.AxSignP1(infoData);	
	if(result != "") 
	{
		return {"Cert":szcaObj.SZCAOcx.AxGetCertDataP1(),"dataInfo":infoData,"sSign":result};
	}
	else
	{
		alert("选择的证书有误!"); 
	}
	return null;
	
}

szcaObj.isIE = function () {
	 return !!window.ActiveXObject || szcaObj.isIE11();// ||
	             // navigator.userAgent.indexOf("MSIE")
	             // > 0;
}

szcaObj.isIE11 = function () {
	 return navigator.userAgent.indexOf("Trident") > 0;
}

szcaObj.ieVersion = function () {
	 if (!szcaObj.isIE())
	  return -1;
	 var browser = navigator.appName;
	 var browserVersion = navigator.appVersion;
	 var version = browserVersion.split(";");
	 var ver = version[1].replace(/[ ]/g,"");
	 if (szcaObj.isIE11())
	  return 11;
	 else if (browser == "Microsoft Internet Explorer" && ver == "MSIE6.0")
	  return 6;
	 else if(browser=="Microsoft Internet Explorer" && ver=="MSIE7.0")
	  return 7;
	 else if(browser=="Microsoft Internet Explorer" && ver=="MSIE8.0")
	  return 8;
	 else if(browser=="Microsoft Internet Explorer" && ver=="MSIE9.0")
	  return 9;
	 else
	  return 10;
}

szcaObj.checkBrowseVersion = function(requiredIE, errorMessage, dontPrompt) {
	 var result = true;
	 var ieVer = szcaObj.isIE() ? szcaObj.ieVersion() : -1;
	 if (requiredIE) {
	  if (ieVer == -1)
	   result = false;
	  else if (ieVer < 8)
	   result = false;
	 } else {
	  if (!(ieVer == -1 || ieVer >= 8))
	   result = false;
	 }
	 if (!result && dontPrompt != false) {
	  if (errorMessage)
	   alert(errorMessage);
	  else if (requiredIE)
	   alert('本系统必须运行IE8以上版本，否则无法正常显示页面。(请避免使用360、傲游等第三方浏览器)');
	  else
	   alert('本系统必须运行IE8以上版本或者Google Chrome、FireFox等浏览器，否则无法正常显示页面。(请避免使用360、傲游等第三方浏览器)');
	 }
	 return result; 
}
/**
 * 判断指定业务类别是否使用CA竞价
 * businessType 业务类别
 * 返回值：-1已启用但浏览器（非IE）不支持，0未启用，1启用且浏览器支持（IE浏览器）
 */
szcaObj.ifUseCa = function(businessType, dontPrompt) {
    szcaObj.useCA = 0;
    $.ajax({
		url: basePath+ "/web/getIfUseCa",
		type: "POST",
		async: false,
		data: {
			"businessType" : businessType,
			"captchaCodeHeader":$("#captchaCodeHeaderca").val(),
			"time":new Date().getTime()
		},
		dataType: "json", //指定服务器返回的数据类型
		success: function(r) {
			if(r.code == 0) {
				var params=r.params
				if(params && params.lvalue == 1){
					if (!szcaObj.checkBrowseVersion(true, '系统已启用CA报价功能，浏览器必须IE9或更高版本，否则无法正常显示页面。(请避免使用360、傲游等第三方浏览器)', dontPrompt)){
		                szcaObj.useCA = -1;
		            }else{
		                szcaObj.initCa();
		                szcaObj.useCA = 1;
		            }
					
				}else{
					alert("未启用ca登录，请是使用账号密码登录！", "提示！");
				}
			}else{
				alert(r.msg, "提示！");
			}
		},
		error:function(XMLHttpRequest, textStatus, errorThrown) {
		       alert("登录失败！");
		}
	});
    return szcaObj.useCA;
   
    
}

/**
 * CA认证
 */

szcaObj.authCa = function(){
    var caKeyId = null;
    var authObj = {status:false};
    var caObj = szcaObj.getCertExt();
    if(!szcaObj.isEmpty(caObj.keySeriesNumber)){
        szcaObj.keySeriesNumber = caObj.keySeriesNumber;
        caKeyId = caObj.caKeyId;
    }
	if(caKeyId){
        var cmd = new Command('trade', 'Bidder', 'verifyCa');
        cmd.cakey = caKeyId;
        cmd.validTime = caObj.validTime;
        cmd.user_id = Utils.getPageValue("u");
        cmd.success = function(data) {
            if(data && data.state == 1){
                authObj.status = true;
                authObj.caKeyId = this.cakey;
            }else{
                alert(data.message ? data.message : "当前CA与注册绑定CA不匹配！");
            }
        }
        cmd.execute();
	}else{
        alert("未识别到有效CA证书。");
    }
	return authObj;
}

/**
 * 加密数据
 * @param 参数 待加密字符串
 * @return 加密数据对象，返回null为配置不需要加密，或者未插入key等
 */
szcaObj.encrypt = function() {
    if (arguments.length == 0 || comObj.isEmpty(szcaObj.keySeriesNumber))
    	return null;
    var plainStr = szcaObj.signData;
	for (var i = 0; i < arguments.length; i++)
		plainStr += "," + arguments[i];
    var encCertData = SZCAOcx.AxGetEncCertBySignSN(szcaObj.keySeriesNumber);
    var symmKey = SZCAOcx.AxCreateSymmKeyBySignSN(szcaObj.keySeriesNumber);
    var encData = SZCAOcx.AxSymmEncryptDataBySignSN(plainStr, symmKey, szcaObj.keySeriesNumber);
    var envelop = SZCAOcx.AxEnveEncryptDataBySignSN(symmKey, encCertData, szcaObj.keySeriesNumber);
    var cipherfilehash = SZCAOcx.AxGetHash(encData); //计算字符串hash
    var cipherTextsignData = SZCAOcx.AxSignBySn(szcaObj.keySeriesNumber, cipherfilehash); //加密文件hash签名
    var result = {};
    result.plain = plainStr;
    result.encdata = encData;
    result.envelop = envelop;
    result.sign = cipherTextsignData;
    return result;
}

szcaObj.decrypt = function(keySeriesNumber, cipherStr, crypt, sign) {
	var result = {};
	result.state = 0; //信息不全
	if (!(keySeriesNumber && cipherStr && crypt && sign))
		return result;
	
	result.state = 1; //签名验证失败，解密失败
	//验证签名（对比加密文件签名前后的hash值是否一致）
	var hashData5 = SZCAOcx.AxParseSignedData(sign, 1);//通过签名值获取加密文件hash
	var hashData6 = SZCAOcx.AxGetHash(cipherStr);//计算加密字符串hash
	if (hashData5 == hashData6) {
		//签名验证成功，开始解密
		result.state = 2;
    	//数字信封解密（得到对称秘钥）
		var envelopPlain = SZCAOcx.AxEnveDecryptDataBySignSN(crypt, keySeriesNumber);
		//字符串解密（使用对称秘钥对加密文件解密）
		var decData = SZCAOcx.AxSymmDecryptDataBySignSN (cipherStr, envelopPlain, keySeriesNumber);
		result.decrypt = decData;
	}
	return result;
}

/**
 * 保存加密出价记录
 * @param offerId
 * @param licenseId
 * @param offerDate
 * @param price
 */
szcaObj.encryptOfferData = function(offerId, licenseId, offerDate, price) {
    if (!szcaObj.useCA)
    	return;
    var encryptResult = szcaObj.encrypt(offerId, licenseId, offerDate, price);
    if (!encryptResult) {
    	alert("CA签名失败！");
    	return;
    }
    //异步保存出价数据
    var cmd = new Command('tradehouse', 'NewTrade', 'targetOfferEnPrice');
    cmd.offer_id = offerId;
    cmd.ca_str = encryptResult.encdata;
    cmd.ca_crypt = encryptResult.envelop;
    cmd.ca_sign = encryptResult.sign;
    cmd.success = function(data) {
    }
    cmd.executeAsync();
}

szcaObj.isEmpty = function(exp){
    if(exp){
        if(typeof(exp)=="undefined" && exp.length <= 0)
            return true;
        else
            return false;
    }else if(0 === exp){
        return false;
    }else{
        return true;
    }
}