const parseCertUtil = {};
const forge = require('node-forge');
const pki = forge.pki;

parseCertUtil.parse = function (data) {
    let certificateData = pki.certificateFromPem(data);

    let subject = _.map(certificateData.subject.attributes, function (attribute) {
        return `${attribute.shortName}=${attribute.value}`;
    }).join(' ');
    let issuer = _.map(certificateData.issuer.attributes, function (attribute) {
        return `${attribute.shortName}=${attribute.value}`;
    }).join(' ');
    let notBefore = moment(certificateData.validity.notBefore).toISOString();
    let notAfter = moment(certificateData.validity.notAfter).toISOString();

    return {
        subject: subject,
        issuer: issuer,
        notBefore: notBefore,
        notAfter: notAfter,
        pem: data.toString('utf8')
    }
};

module.exports = parseCertUtil;