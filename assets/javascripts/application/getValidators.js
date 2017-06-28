function getValidators(web3, func, contractAddress, disabled, cb) {
	SHA3Encrypt(web3, func, function(funcEncode) {
		var funcEncodePart = funcEncode.substring(0,10);

		var data = funcEncodePart;
		
		call(web3, null, contractAddress, data, function(validatorsResp) {
			validatorsResp = validatorsResp.substring(2, validatorsResp.length);
			var validatorsArray = [];
			var item = "";
			for (var i = 0; i < validatorsResp.length; i++) {
				item+=validatorsResp[i];
				if ((i + 1)%64 == 0) {
					item = item.substr(item.length - 40, 40);
					validatorsArray.push(item);
					item = "";
				}
			}
			validatorsArray.shift();
			validatorsArray.shift(); //number of elements

			if (validatorsArray.length == 0) {
				cb(validatorsArray);
				return;
			}

			var validatorsArrayOut = [];
			var iasync = 0;
			var validatorDataCount = 6;
			if (disabled)
				validatorDataCount = 7;
			for (var i = 0; i < validatorsArray.length; i++) {
				getValidatorFullName(web3, validatorsArray[i], i, contractAddress, function(_i, resp) {
					iasync++;
					validatorsArrayOut = getPropertyCallback("fullName", resp, _i, iasync, validatorsArray, validatorDataCount, validatorsArrayOut, cb);
				});

				getValidatorStreetName(web3, validatorsArray[i], i, contractAddress, function(_i, resp) {
					iasync++;
					validatorsArrayOut = getPropertyCallback("streetName", resp, _i, iasync, validatorsArray, validatorDataCount, validatorsArrayOut, cb);
				});

				getValidatorState(web3, validatorsArray[i], i, contractAddress, function(_i, resp) {
					iasync++;
					validatorsArrayOut = getPropertyCallback("state", resp, _i, iasync, validatorsArray, validatorDataCount, validatorsArrayOut, cb);
				});

				getValidatorLicenseExpiredAt(web3, validatorsArray[i], i, contractAddress, function(_i, resp) {
					iasync++;
					validatorsArrayOut = getPropertyCallback("licenseExpiredAt", resp, _i, iasync, validatorsArray, validatorDataCount, validatorsArrayOut, cb);
				});

				getValidatorZip(web3, validatorsArray[i], i, contractAddress, function(_i, resp) {
					iasync++;
					validatorsArrayOut = getPropertyCallback("zip", resp, _i, iasync, validatorsArray, validatorDataCount, validatorsArrayOut, cb);
				});

				getValidatorLicenseID(web3, validatorsArray[i], i, contractAddress, function(_i, resp) {
					iasync++;
					validatorsArrayOut = getPropertyCallback("licenseID", resp, _i, iasync, validatorsArray, validatorDataCount, validatorsArrayOut, cb);
				});

				if (disabled) {
					getValidatorDisablingDate(web3, validatorsArray[i], i, contractAddress, function(_i, resp) {
						iasync++;
						validatorsArrayOut = getPropertyCallback("disablingDate", resp, _i, iasync, validatorsArray, validatorDataCount, validatorsArrayOut, cb);
					});
				}
			}
		});
	});
}

function getPropertyCallback(prop, resp, _i, iasync, validatorsArray, validatorDataCount, validatorsArrayOut, cb) {
	if (validatorsArrayOut.length == _i) {
		var validator = {};
		validator[validatorsArray[_i]] = {};
		validator[validatorsArray[_i]][prop] = resp;
		validatorsArrayOut.push(validator);
	} else {
		validatorsArrayOut[_i][validatorsArray[_i]][prop] = resp;
	}

	if (iasync == validatorsArray.length*validatorDataCount) {
		cb(validatorsArrayOut);
		return false;
	} else {
		return validatorsArrayOut;
	}
}