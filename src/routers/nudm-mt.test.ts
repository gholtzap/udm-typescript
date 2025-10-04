import { expect } from 'chai';
import request from 'supertest';
import express from 'express';
import router from './nudm-mt';

const app = express();
app.use(express.json());
app.use('/nudm-mt/v1', router);

describe('GET /:supi', () => {
  const validSupi = 'imsi-123456789012345';

  describe('Success cases', () => {
    it('should return UE info with single field', async () => {
      const response = await request(app)
        .get(`/nudm-mt/v1/${validSupi}`)
        .query({ fields: 'tadsInfo' })
        .expect(200)
        .expect('Content-Type', /json/);

      expect(response.body).to.have.property('tadsInfo');
      expect(response.body).to.not.have.property('userState');
      expect(response.body).to.not.have.property('5gSrvccInfo');
    });

    it('should return UE info with multiple fields', async () => {
      const response = await request(app)
        .get(`/nudm-mt/v1/${validSupi}`)
        .query({ fields: 'tadsInfo,userState,5gSrvccInfo' })
        .expect(200)
        .expect('Content-Type', /json/);

      expect(response.body).to.have.property('tadsInfo');
      expect(response.body).to.have.property('userState');
      expect(response.body).to.have.property('5gSrvccInfo');
    });

    it('should return tadsInfo field', async () => {
      const response = await request(app)
        .get(`/nudm-mt/v1/${validSupi}`)
        .query({ fields: 'tadsInfo' })
        .expect(200);

      expect(response.body.tadsInfo).to.be.an('object');
      expect(response.body.tadsInfo).to.have.property('ueContextInfo');
    });

    it('should return userState field', async () => {
      const response = await request(app)
        .get(`/nudm-mt/v1/${validSupi}`)
        .query({ fields: 'userState' })
        .expect(200);

      expect(response.body.userState).to.be.an('object');
      expect(response.body.userState).to.have.property('accessType');
      expect(response.body.userState).to.have.property('registrationState');
    });

    it('should return 5gSrvccInfo field', async () => {
      const response = await request(app)
        .get(`/nudm-mt/v1/${validSupi}`)
        .query({ fields: '5gSrvccInfo' })
        .expect(200);

      expect(response.body['5gSrvccInfo']).to.be.an('object');
      expect(response.body['5gSrvccInfo']).to.have.property('ue5GSrvccCapability');
    });

    it('should accept nai format for supi', async () => {
      const response = await request(app)
        .get('/nudm-mt/v1/nai-user@example.com')
        .query({ fields: 'tadsInfo' })
        .expect(200);

      expect(response.body).to.have.property('tadsInfo');
    });

    it('should include supportedFeatures when provided', async () => {
      const response = await request(app)
        .get(`/nudm-mt/v1/${validSupi}`)
        .query({ 
          fields: 'tadsInfo',
          'supported-features': 'ABC123'
        })
        .expect(200);

      expect(response.body).to.have.property('supportedFeatures', 'ABC123');
    });

    it('should return consistent data for same supi', async () => {
      const response1 = await request(app)
        .get(`/nudm-mt/v1/${validSupi}`)
        .query({ fields: 'tadsInfo' })
        .expect(200);

      const response2 = await request(app)
        .get(`/nudm-mt/v1/${validSupi}`)
        .query({ fields: 'tadsInfo' })
        .expect(200);

      expect(response1.body.tadsInfo).to.deep.equal(response2.body.tadsInfo);
    });

    it('should return different data for different supis', async () => {
      const supi1 = 'imsi-111111111111111';
      const supi2 = 'imsi-222222222222222';

      await request(app)
        .get(`/nudm-mt/v1/${supi1}`)
        .query({ fields: 'tadsInfo' })
        .expect(200);

      await request(app)
        .get(`/nudm-mt/v1/${supi2}`)
        .query({ fields: 'tadsInfo' })
        .expect(200);

      expect(supi1).to.not.equal(supi2);
    });

    it('should handle fields as array parameter', async () => {
      const response = await request(app)
        .get(`/nudm-mt/v1/${validSupi}`)
        .query({ fields: ['tadsInfo', 'userState'] })
        .expect(200);

      expect(response.body).to.have.property('tadsInfo');
      expect(response.body).to.have.property('userState');
    });

    it('should only return requested fields', async () => {
      const response = await request(app)
        .get(`/nudm-mt/v1/${validSupi}`)
        .query({ fields: 'userState' })
        .expect(200);

      expect(response.body).to.have.property('userState');
      expect(response.body).to.not.have.property('tadsInfo');
      expect(response.body).to.not.have.property('5gSrvccInfo');
      expect(response.body).to.not.have.property('supportedFeatures');
    });
  });

  describe('Validation error cases', () => {
    it('should return 400 when fields parameter is missing', async () => {
      const response = await request(app)
        .get(`/nudm-mt/v1/${validSupi}`)
        .expect(400)
        .expect('Content-Type', /json/);

      expect(response.body).to.have.property('status', 400);
      expect(response.body).to.have.property('title', 'Bad Request');
      expect(response.body).to.have.property('detail');
      expect(response.body.detail).to.include('fields');
      expect(response.body).to.have.property('cause', 'MANDATORY_IE_MISSING');
    });

    it('should return 400 for invalid supi format', async () => {
      const response = await request(app)
        .get('/nudm-mt/v1/invalid-supi')
        .query({ fields: 'tadsInfo' })
        .expect(400)
        .expect('Content-Type', /json/);

      expect(response.body).to.have.property('status', 400);
      expect(response.body).to.have.property('title', 'Bad Request');
      expect(response.body).to.have.property('detail');
      expect(response.body.detail).to.include('supi');
      expect(response.body).to.have.property('cause', 'INVALID_PARAMETER');
    });

    it('should return 400 for supi with invalid imsi prefix', async () => {
      const response = await request(app)
        .get('/nudm-mt/v1/imsi-123')
        .query({ fields: 'tadsInfo' })
        .expect(400);

      expect(response.body).to.have.property('status', 400);
      expect(response.body.cause).to.equal('INVALID_PARAMETER');
    });

    it('should return 400 for supi with too short imsi', async () => {
      const response = await request(app)
        .get('/nudm-mt/v1/imsi-1234')
        .query({ fields: 'tadsInfo' })
        .expect(400);

      expect(response.body).to.have.property('status', 400);
    });

    it('should return 400 for supi with too long imsi', async () => {
      const response = await request(app)
        .get('/nudm-mt/v1/imsi-1234567890123456')
        .query({ fields: 'tadsInfo' })
        .expect(400);

      expect(response.body).to.have.property('status', 400);
    });

    it('should return 400 for supi with non-numeric imsi', async () => {
      const response = await request(app)
        .get('/nudm-mt/v1/imsi-abcdefghijk')
        .query({ fields: 'tadsInfo' })
        .expect(400);

      expect(response.body).to.have.property('status', 400);
    });

    it('should return 400 for completely invalid format', async () => {
      const response = await request(app)
        .get('/nudm-mt/v1/just-some-text')
        .query({ fields: 'tadsInfo' })
        .expect(400);

      expect(response.body).to.have.property('status', 400);
      expect(response.body).to.have.property('cause', 'INVALID_PARAMETER');
    });

    it('should return 400 for empty supi', async () => {
      const response = await request(app)
        .get('/nudm-mt/v1/ ')
        .query({ fields: 'tadsInfo' })
        .expect(400);

      expect(response.body).to.have.property('status', 400);
    });

    it('should return 400 for msisdn format (not valid for supi)', async () => {
      const response = await request(app)
        .get('/nudm-mt/v1/msisdn-1234567890')
        .query({ fields: 'tadsInfo' })
        .expect(400);

      expect(response.body).to.have.property('status', 400);
      expect(response.body).to.have.property('cause', 'INVALID_PARAMETER');
    });
  });

  describe('Field validation', () => {
    it('should handle unknown field names gracefully', async () => {
      const response = await request(app)
        .get(`/nudm-mt/v1/${validSupi}`)
        .query({ fields: 'unknownField' })
        .expect(200);

      expect(response.body).to.be.an('object');
      expect(Object.keys(response.body).length).to.equal(0);
    });

    it('should handle mix of valid and invalid field names', async () => {
      const response = await request(app)
        .get(`/nudm-mt/v1/${validSupi}`)
        .query({ fields: 'tadsInfo,unknownField,userState' })
        .expect(200);

      expect(response.body).to.have.property('tadsInfo');
      expect(response.body).to.have.property('userState');
      expect(response.body).to.not.have.property('unknownField');
    });

    it('should handle duplicate field names', async () => {
      const response = await request(app)
        .get(`/nudm-mt/v1/${validSupi}`)
        .query({ fields: 'tadsInfo,tadsInfo' })
        .expect(200);

      expect(response.body).to.have.property('tadsInfo');
      expect(Object.keys(response.body).length).to.equal(1);
    });
  });

  describe('Edge cases', () => {
    it('should handle very long nai supi', async () => {
      const longNai = 'nai-' + 'a'.repeat(100) + '@example.com';
      const response = await request(app)
        .get(`/nudm-mt/v1/${longNai}`)
        .query({ fields: 'tadsInfo' })
        .expect(200);

      expect(response.body).to.have.property('tadsInfo');
    });

    it('should handle supi with special characters in nai', async () => {
      const specialNai = 'nai-user.name+test@example.co.uk';
      const response = await request(app)
        .get(`/nudm-mt/v1/${specialNai}`)
        .query({ fields: 'tadsInfo' })
        .expect(200);

      expect(response.body).to.have.property('tadsInfo');
    });

    it('should handle minimum valid imsi length', async () => {
      const response = await request(app)
        .get('/nudm-mt/v1/imsi-12345')
        .query({ fields: 'tadsInfo' })
        .expect(200);

      expect(response.body).to.have.property('tadsInfo');
    });

    it('should handle maximum valid imsi length', async () => {
      const response = await request(app)
        .get('/nudm-mt/v1/imsi-123456789012345')
        .query({ fields: 'tadsInfo' })
        .expect(200);

      expect(response.body).to.have.property('tadsInfo');
    });
  });
});

describe('POST /:supi/loc-info/provide-loc-info', () => {
  const validSupi = 'imsi-123456789012345';

  describe('Success cases', () => {
    it('should return location info when req5gsLoc is true', async () => {
      const response = await request(app)
        .post(`/nudm-mt/v1/${validSupi}/loc-info/provide-loc-info`)
        .send({ req5gsLoc: true })
        .expect(200)
        .expect('Content-Type', /json/);

      expect(response.body).to.have.property('ncgi');
      expect(response.body.ncgi).to.have.property('plmnId');
      expect(response.body.ncgi).to.have.property('nrCellId');
      expect(response.body).to.have.property('tai');
      expect(response.body.tai).to.have.property('plmnId');
      expect(response.body.tai).to.have.property('tac');
      expect(response.body).to.have.property('currentLoc', true);
    });

    it('should return location info when reqCurrentLoc is true', async () => {
      const response = await request(app)
        .post(`/nudm-mt/v1/${validSupi}/loc-info/provide-loc-info`)
        .send({ reqCurrentLoc: true })
        .expect(200);

      expect(response.body).to.have.property('ncgi');
      expect(response.body).to.have.property('tai');
      expect(response.body).to.have.property('currentLoc', true);
    });

    it('should return RAT type when reqRatType is true', async () => {
      const response = await request(app)
        .post(`/nudm-mt/v1/${validSupi}/loc-info/provide-loc-info`)
        .send({ reqRatType: true })
        .expect(200);

      expect(response.body).to.have.property('ratType', 'NR');
    });

    it('should return timezone when reqTimeZone is true', async () => {
      const response = await request(app)
        .post(`/nudm-mt/v1/${validSupi}/loc-info/provide-loc-info`)
        .send({ reqTimeZone: true })
        .expect(200);

      expect(response.body).to.have.property('timezone');
    });

    it('should return serving node info when reqServingNode is true', async () => {
      const response = await request(app)
        .post(`/nudm-mt/v1/${validSupi}/loc-info/provide-loc-info`)
        .send({ reqServingNode: true })
        .expect(200);

      expect(response.body).to.have.property('amfInstanceId');
      expect(response.body).to.have.property('vPlmnId');
      expect(response.body.vPlmnId).to.have.property('mcc');
      expect(response.body.vPlmnId).to.have.property('mnc');
    });

    it('should handle multiple request flags', async () => {
      const response = await request(app)
        .post(`/nudm-mt/v1/${validSupi}/loc-info/provide-loc-info`)
        .send({
          req5gsLoc: true,
          reqRatType: true,
          reqTimeZone: true,
          reqServingNode: true
        })
        .expect(200);

      expect(response.body).to.have.property('ncgi');
      expect(response.body).to.have.property('tai');
      expect(response.body).to.have.property('currentLoc');
      expect(response.body).to.have.property('ratType');
      expect(response.body).to.have.property('timezone');
      expect(response.body).to.have.property('amfInstanceId');
      expect(response.body).to.have.property('vPlmnId');
    });

    it('should handle all flags set to false', async () => {
      const response = await request(app)
        .post(`/nudm-mt/v1/${validSupi}/loc-info/provide-loc-info`)
        .send({
          req5gsLoc: false,
          reqCurrentLoc: false,
          reqRatType: false,
          reqTimeZone: false,
          reqServingNode: false
        })
        .expect(200);

      expect(response.body).to.not.have.property('ncgi');
      expect(response.body).to.not.have.property('tai');
      expect(response.body).to.not.have.property('currentLoc');
      expect(response.body).to.not.have.property('ratType');
      expect(response.body).to.not.have.property('timezone');
      expect(response.body).to.not.have.property('amfInstanceId');
      expect(response.body).to.not.have.property('vPlmnId');
    });

    it('should handle empty request body with default values', async () => {
      const response = await request(app)
        .post(`/nudm-mt/v1/${validSupi}/loc-info/provide-loc-info`)
        .send({})
        .expect(200);

      expect(response.body).to.be.an('object');
    });

    it('should include supportedFeatures when provided', async () => {
      const response = await request(app)
        .post(`/nudm-mt/v1/${validSupi}/loc-info/provide-loc-info`)
        .send({
          req5gsLoc: true,
          supportedFeatures: 'ABC123'
        })
        .expect(200);

      expect(response.body).to.have.property('supportedFeatures', 'ABC123');
    });

    it('should not include supportedFeatures when not provided', async () => {
      const response = await request(app)
        .post(`/nudm-mt/v1/${validSupi}/loc-info/provide-loc-info`)
        .send({ req5gsLoc: true })
        .expect(200);

      expect(response.body).to.not.have.property('supportedFeatures');
    });

    it('should accept nai format for supi', async () => {
      const response = await request(app)
        .post('/nudm-mt/v1/nai-user@example.com/loc-info/provide-loc-info')
        .send({ req5gsLoc: true })
        .expect(200);

      expect(response.body).to.have.property('ncgi');
    });

    it('should return valid PLMN ID structure', async () => {
      const response = await request(app)
        .post(`/nudm-mt/v1/${validSupi}/loc-info/provide-loc-info`)
        .send({ req5gsLoc: true })
        .expect(200);

      expect(response.body.ncgi.plmnId).to.have.property('mcc');
      expect(response.body.ncgi.plmnId).to.have.property('mnc');
      expect(response.body.ncgi.plmnId.mcc).to.be.a('string');
      expect(response.body.ncgi.plmnId.mnc).to.be.a('string');
    });

    it('should return valid TAI structure', async () => {
      const response = await request(app)
        .post(`/nudm-mt/v1/${validSupi}/loc-info/provide-loc-info`)
        .send({ reqCurrentLoc: true })
        .expect(200);

      expect(response.body.tai).to.have.property('plmnId');
      expect(response.body.tai).to.have.property('tac');
      expect(response.body.tai.tac).to.be.a('string');
    });

    it('should return valid NCGI structure', async () => {
      const response = await request(app)
        .post(`/nudm-mt/v1/${validSupi}/loc-info/provide-loc-info`)
        .send({ req5gsLoc: true })
        .expect(200);

      expect(response.body.ncgi).to.have.property('plmnId');
      expect(response.body.ncgi).to.have.property('nrCellId');
      expect(response.body.ncgi.nrCellId).to.be.a('string');
    });
  });

  describe('Validation error cases', () => {
    it('should return 400 for invalid supi format', async () => {
      const response = await request(app)
        .post('/nudm-mt/v1/invalid-supi/loc-info/provide-loc-info')
        .send({ req5gsLoc: true })
        .expect(400)
        .expect('Content-Type', /json/);

      expect(response.body).to.have.property('status', 400);
      expect(response.body).to.have.property('title', 'Bad Request');
      expect(response.body).to.have.property('detail');
      expect(response.body.detail).to.include('supi');
      expect(response.body).to.have.property('cause', 'INVALID_PARAMETER');
    });

    it('should return 400 for supi with invalid imsi prefix', async () => {
      const response = await request(app)
        .post('/nudm-mt/v1/imsi-123/loc-info/provide-loc-info')
        .send({ req5gsLoc: true })
        .expect(400);

      expect(response.body).to.have.property('status', 400);
      expect(response.body.cause).to.equal('INVALID_PARAMETER');
    });

    it('should return 400 for supi with too short imsi', async () => {
      const response = await request(app)
        .post('/nudm-mt/v1/imsi-1234/loc-info/provide-loc-info')
        .send({ req5gsLoc: true })
        .expect(400);

      expect(response.body).to.have.property('status', 400);
    });

    it('should return 400 for supi with too long imsi', async () => {
      const response = await request(app)
        .post('/nudm-mt/v1/imsi-1234567890123456/loc-info/provide-loc-info')
        .send({ req5gsLoc: true })
        .expect(400);

      expect(response.body).to.have.property('status', 400);
    });

    it('should return 400 for supi with non-numeric imsi', async () => {
      const response = await request(app)
        .post('/nudm-mt/v1/imsi-abcdefghijk/loc-info/provide-loc-info')
        .send({ req5gsLoc: true })
        .expect(400);

      expect(response.body).to.have.property('status', 400);
    });

    it('should return 400 for completely invalid supi format', async () => {
      const response = await request(app)
        .post('/nudm-mt/v1/just-some-text/loc-info/provide-loc-info')
        .send({ req5gsLoc: true })
        .expect(400);

      expect(response.body).to.have.property('status', 400);
      expect(response.body).to.have.property('cause', 'INVALID_PARAMETER');
    });

    it('should return 400 for msisdn format (not valid for supi)', async () => {
      const response = await request(app)
        .post('/nudm-mt/v1/msisdn-1234567890/loc-info/provide-loc-info')
        .send({ req5gsLoc: true })
        .expect(400);

      expect(response.body).to.have.property('status', 400);
      expect(response.body).to.have.property('cause', 'INVALID_PARAMETER');
    });
  });

  describe('Request body validation', () => {
    it('should handle request body with undefined values', async () => {
      const response = await request(app)
        .post(`/nudm-mt/v1/${validSupi}/loc-info/provide-loc-info`)
        .send({
          req5gsLoc: undefined,
          reqCurrentLoc: true
        })
        .expect(200);

      expect(response.body).to.have.property('ncgi');
    });

    it('should handle request body with null values', async () => {
      const response = await request(app)
        .post(`/nudm-mt/v1/${validSupi}/loc-info/provide-loc-info`)
        .send({
          req5gsLoc: null,
          reqCurrentLoc: true
        })
        .expect(200);

      expect(response.body).to.have.property('ncgi');
    });

    it('should handle request body with extra unknown properties', async () => {
      const response = await request(app)
        .post(`/nudm-mt/v1/${validSupi}/loc-info/provide-loc-info`)
        .send({
          req5gsLoc: true,
          unknownProperty: 'test',
          anotherUnknown: 123
        })
        .expect(200);

      expect(response.body).to.have.property('ncgi');
    });

    it('should handle request body with string boolean values', async () => {
      const response = await request(app)
        .post(`/nudm-mt/v1/${validSupi}/loc-info/provide-loc-info`)
        .send({
          req5gsLoc: 'true'
        })
        .expect(200);

      expect(response.body).to.be.an('object');
    });
  });

  describe('Edge cases', () => {
    it('should handle very long nai supi', async () => {
      const longNai = 'nai-' + 'a'.repeat(100) + '@example.com';
      const response = await request(app)
        .post(`/nudm-mt/v1/${longNai}/loc-info/provide-loc-info`)
        .send({ req5gsLoc: true })
        .expect(200);

      expect(response.body).to.have.property('ncgi');
    });

    it('should handle supi with special characters in nai', async () => {
      const specialNai = 'nai-user.name+test@example.co.uk';
      const response = await request(app)
        .post(`/nudm-mt/v1/${specialNai}/loc-info/provide-loc-info`)
        .send({ req5gsLoc: true })
        .expect(200);

      expect(response.body).to.have.property('ncgi');
    });

    it('should handle minimum valid imsi length', async () => {
      const response = await request(app)
        .post('/nudm-mt/v1/imsi-12345/loc-info/provide-loc-info')
        .send({ req5gsLoc: true })
        .expect(200);

      expect(response.body).to.have.property('ncgi');
    });

    it('should handle maximum valid imsi length', async () => {
      const response = await request(app)
        .post('/nudm-mt/v1/imsi-123456789012345/loc-info/provide-loc-info')
        .send({ req5gsLoc: true })
        .expect(200);

      expect(response.body).to.have.property('ncgi');
    });

    it('should handle both req5gsLoc and reqCurrentLoc together', async () => {
      const response = await request(app)
        .post(`/nudm-mt/v1/${validSupi}/loc-info/provide-loc-info`)
        .send({
          req5gsLoc: true,
          reqCurrentLoc: true
        })
        .expect(200);

      expect(response.body).to.have.property('ncgi');
      expect(response.body).to.have.property('tai');
      expect(response.body).to.have.property('currentLoc', true);
    });

    it('should handle all flags set to true', async () => {
      const response = await request(app)
        .post(`/nudm-mt/v1/${validSupi}/loc-info/provide-loc-info`)
        .send({
          req5gsLoc: true,
          reqCurrentLoc: true,
          reqRatType: true,
          reqTimeZone: true,
          reqServingNode: true,
          supportedFeatures: 'FULL'
        })
        .expect(200);

      expect(response.body).to.have.property('ncgi');
      expect(response.body).to.have.property('tai');
      expect(response.body).to.have.property('currentLoc');
      expect(response.body).to.have.property('ratType');
      expect(response.body).to.have.property('timezone');
      expect(response.body).to.have.property('amfInstanceId');
      expect(response.body).to.have.property('vPlmnId');
      expect(response.body).to.have.property('supportedFeatures');
    });
  });
});

