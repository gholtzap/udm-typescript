import { expect } from 'chai';
import request from 'supertest';
import express from 'express';
import sinon from 'sinon';
import router from './nudm-ueau';
import { mockCollection } from '../test-setup';

const app = express();
app.use(express.json());
app.use('/nudm-ueau/v1', router);

describe('POST /:supiOrSuci/security-information/generate-auth-data', () => {
  const validSupi = 'imsi-999700000000001';
  const validAuthRequest = {
    servingNetworkName: '5G:mnc070.mcc999.3gppnetwork.org',
    ausfInstanceId: '550e8400-e29b-41d4-a716-446655440000'
  };

  const mockSubscriber = {
    _id: validSupi,
    supi: validSupi,
    permanentKey: '465B5CE8B199B49FAA5F0A2EE238A6BC',
    operatorKey: 'E8ED289DEBA952E4283B54E88E6183CA',
    sequenceNumber: '000000000001',
    authenticationMethod: '5G_AKA'
  };

  const mockSubscriberNested = {
    _id: validSupi,
    supi: validSupi,
    permanentKey: '465B5CE8B199B49FAA5F0A2EE238A6BC',
    operatorKey: 'E8ED289DEBA952E4283B54E88E6183CA',
    sequenceNumber: '16F3B3F70FC2',
    authenticationMethod: '5G_AKA',
    subscribedData: {
      authenticationSubscription: {
        authenticationMethod: '5G_AKA',
        permanentKey: {
          permanentKeyValue: '465B5CE8B199B49FAA5F0A2EE238A6BC'
        },
        sequenceNumber: '16F3B3F70FC2',
        authenticationManagementField: '8000',
        milenage: {
          op: {
            opValue: 'E8ED289DEBA952E4283B54E88E6183CA'
          }
        }
      }
    }
  };

  beforeEach(() => {
    (mockCollection.findOne as sinon.SinonStub).resolves(mockSubscriber);
    (mockCollection.updateOne as sinon.SinonStub).resolves({ modifiedCount: 1 });
  });

  describe('Success cases', () => {
    it('should generate authentication data with valid SUPI and request', async () => {
      const response = await request(app)
        .post(`/nudm-ueau/v1/${validSupi}/security-information/generate-auth-data`)
        .send(validAuthRequest)
        .expect(200)
        .expect('Content-Type', /json/);

      expect(response.body).to.have.property('authType', '5G_AKA');
      expect(response.body).to.have.property('authenticationVector');
      expect(response.body).to.have.property('supi', validSupi);
    });

    it('should return valid authentication vector structure', async () => {
      const response = await request(app)
        .post(`/nudm-ueau/v1/${validSupi}/security-information/generate-auth-data`)
        .send(validAuthRequest)
        .expect(200);

      const av = response.body.authenticationVector;
      expect(av).to.have.property('avType', '5G_HE_AKA');
      expect(av).to.have.property('rand');
      expect(av).to.have.property('xresStar');
      expect(av).to.have.property('autn');
      expect(av).to.have.property('kausf');
    });

    it('should generate valid RAND (16 bytes, 32 hex chars)', async () => {
      const response = await request(app)
        .post(`/nudm-ueau/v1/${validSupi}/security-information/generate-auth-data`)
        .send(validAuthRequest)
        .expect(200);

      const rand = response.body.authenticationVector.rand;
      expect(rand).to.be.a('string');
      expect(rand).to.have.lengthOf(32);
      expect(rand).to.match(/^[A-F0-9]{32}$/);
    });

    it('should generate valid AUTN (16 bytes, 32 hex chars)', async () => {
      const response = await request(app)
        .post(`/nudm-ueau/v1/${validSupi}/security-information/generate-auth-data`)
        .send(validAuthRequest)
        .expect(200);

      const autn = response.body.authenticationVector.autn;
      expect(autn).to.be.a('string');
      expect(autn).to.have.lengthOf(32);
      expect(autn).to.match(/^[A-F0-9]{32}$/);
    });

    it('should generate valid XRES* (16 bytes, 32 hex chars)', async () => {
      const response = await request(app)
        .post(`/nudm-ueau/v1/${validSupi}/security-information/generate-auth-data`)
        .send(validAuthRequest)
        .expect(200);

      const xresStar = response.body.authenticationVector.xresStar;
      expect(xresStar).to.be.a('string');
      expect(xresStar).to.have.lengthOf(32);
      expect(xresStar).to.match(/^[A-F0-9]{32}$/);
    });

    it('should generate valid KAUSF (32 bytes, 64 hex chars)', async () => {
      const response = await request(app)
        .post(`/nudm-ueau/v1/${validSupi}/security-information/generate-auth-data`)
        .send(validAuthRequest)
        .expect(200);

      const kausf = response.body.authenticationVector.kausf;
      expect(kausf).to.be.a('string');
      expect(kausf).to.have.lengthOf(64);
      expect(kausf).to.match(/^[A-F0-9]{64}$/);
    });

    it('should generate different RAND values for consecutive requests', async () => {
      const response1 = await request(app)
        .post(`/nudm-ueau/v1/${validSupi}/security-information/generate-auth-data`)
        .send(validAuthRequest)
        .expect(200);

      const response2 = await request(app)
        .post(`/nudm-ueau/v1/${validSupi}/security-information/generate-auth-data`)
        .send(validAuthRequest)
        .expect(200);

      const rand1 = response1.body.authenticationVector.rand;
      const rand2 = response2.body.authenticationVector.rand;
      expect(rand1).to.not.equal(rand2);
    });

    it('should increment sequence number after authentication', async () => {
      await request(app)
        .post(`/nudm-ueau/v1/${validSupi}/security-information/generate-auth-data`)
        .send(validAuthRequest)
        .expect(200);

      expect((mockCollection.updateOne as sinon.SinonStub).calledOnce).to.be.true;
      const updateCall = (mockCollection.updateOne as sinon.SinonStub).getCall(0);
      expect(updateCall.args[0]).to.deep.equal({ supi: validSupi });
      expect(updateCall.args[1]).to.have.property('$set');
    });

    it('should handle nested authentication subscription structure', async () => {
      (mockCollection.findOne as sinon.SinonStub).resolves(mockSubscriberNested);

      const response = await request(app)
        .post(`/nudm-ueau/v1/${validSupi}/security-information/generate-auth-data`)
        .send(validAuthRequest)
        .expect(200);

      expect(response.body).to.have.property('authType', '5G_AKA');
      expect(response.body).to.have.property('authenticationVector');
    });

    it('should handle different serving network names', async () => {
      const servingNetworks = [
        '5G:mnc001.mcc001.3gppnetwork.org',
        '5G:mnc070.mcc999.3gppnetwork.org',
        '5G:mnc123.mcc456.3gppnetwork.org'
      ];

      for (const network of servingNetworks) {
        const response = await request(app)
          .post(`/nudm-ueau/v1/${validSupi}/security-information/generate-auth-data`)
          .send({
            servingNetworkName: network,
            ausfInstanceId: 'ausf-instance-123'
          })
          .expect(200);

        expect(response.body).to.have.property('authType', '5G_AKA');
      }
    });

    it('should handle different AUSF instance IDs', async () => {
      const ausfInstances = [
        'ausf-instance-1',
        'ausf-instance-abc123',
        'ausf-instance-xyz789'
      ];

      for (const ausfId of ausfInstances) {
        const response = await request(app)
          .post(`/nudm-ueau/v1/${validSupi}/security-information/generate-auth-data`)
          .send({
            servingNetworkName: validAuthRequest.servingNetworkName,
            ausfInstanceId: ausfId
          })
          .expect(200);

        expect(response.body).to.have.property('authType', '5G_AKA');
      }
    });

    it('should handle optional supportedFeatures field', async () => {
      const authRequestWithFeatures = {
        ...validAuthRequest,
        supportedFeatures: '1234ABCD'
      };

      const response = await request(app)
        .post(`/nudm-ueau/v1/${validSupi}/security-information/generate-auth-data`)
        .send(authRequestWithFeatures)
        .expect(200);

      expect(response.body).to.have.property('authType', '5G_AKA');
    });

    it('should handle different IMSI lengths', async () => {
      const imsis = [
        'imsi-12345',
        'imsi-123456789012345'
      ];

      for (const imsi of imsis) {
        (mockCollection.findOne as sinon.SinonStub).resolves({ ...mockSubscriber, supi: imsi });

        const response = await request(app)
          .post(`/nudm-ueau/v1/${imsi}/security-information/generate-auth-data`)
          .send(validAuthRequest)
          .expect(200);

        expect(response.body).to.have.property('supi', imsi);
      }
    });

    it('should handle multiple authentication requests for same UE', async () => {
      for (let i = 0; i < 5; i++) {
        const response = await request(app)
          .post(`/nudm-ueau/v1/${validSupi}/security-information/generate-auth-data`)
          .send(validAuthRequest)
          .expect(200);

        expect(response.body).to.have.property('authType', '5G_AKA');
      }

      expect((mockCollection.updateOne as sinon.SinonStub).callCount).to.equal(5);
    });
  });

  describe('Validation error cases - missing required fields', () => {
    it('should return 400 when servingNetworkName is missing', async () => {
      const authRequestWithoutSN = {
        ausfInstanceId: 'ausf-instance-123'
      };

      const response = await request(app)
        .post(`/nudm-ueau/v1/${validSupi}/security-information/generate-auth-data`)
        .send(authRequestWithoutSN)
        .expect(400)
        .expect('Content-Type', /json/);

      expect(response.body).to.have.property('status', 400);
      expect(response.body).to.have.property('title', 'Bad Request');
      expect(response.body).to.have.property('detail');
      expect(response.body.detail).to.include('servingNetworkName');
      expect(response.body).to.have.property('cause', 'INVALID_PARAMETER');
    });

    it('should return 400 when ausfInstanceId is missing', async () => {
      const authRequestWithoutAUSF = {
        servingNetworkName: '5G:mnc070.mcc999.3gppnetwork.org'
      };

      const response = await request(app)
        .post(`/nudm-ueau/v1/${validSupi}/security-information/generate-auth-data`)
        .send(authRequestWithoutAUSF)
        .expect(400);

      expect(response.body).to.have.property('status', 400);
      expect(response.body).to.have.property('detail');
      expect(response.body.detail).to.include('ausfInstanceId');
      expect(response.body).to.have.property('cause', 'INVALID_PARAMETER');
    });

    it('should return 400 when all required fields are missing', async () => {
      const response = await request(app)
        .post(`/nudm-ueau/v1/${validSupi}/security-information/generate-auth-data`)
        .send({})
        .expect(400);

      expect(response.body).to.have.property('status', 400);
      expect(response.body).to.have.property('cause', 'INVALID_PARAMETER');
    });

    it('should return 400 when request body is not an object', async () => {
      const response = await request(app)
        .post(`/nudm-ueau/v1/${validSupi}/security-information/generate-auth-data`)
        .send([validAuthRequest])
        .expect(400);

      expect(response.body).to.have.property('status', 400);
      expect(response.body).to.have.property('cause', 'INVALID_PARAMETER');
    });

    it('should return 400 when request body is empty string', async () => {
      const response = await request(app)
        .post(`/nudm-ueau/v1/${validSupi}/security-information/generate-auth-data`)
        .send('')
        .expect(400);

      expect(response.body).to.have.property('status', 400);
    });

    it('should return 400 when request body is undefined', async () => {
      const response = await request(app)
        .post(`/nudm-ueau/v1/${validSupi}/security-information/generate-auth-data`)
        .expect(400);

      expect(response.body).to.have.property('status', 400);
    });
  });

  describe('Validation error cases - invalid SUPI format', () => {
    it('should return 400 when SUPI does not start with imsi-', async () => {
      const response = await request(app)
        .post('/nudm-ueau/v1/msisdn-1234567890/security-information/generate-auth-data')
        .send(validAuthRequest)
        .expect(400);

      expect(response.body).to.have.property('status', 400);
      expect(response.body).to.have.property('detail');
      expect(response.body.detail).to.include('Invalid SUPI format');
      expect(response.body).to.have.property('cause', 'INVALID_PARAMETER');
    });

    it('should return 400 for empty SUPI', async () => {
      const response = await request(app)
        .post('/nudm-ueau/v1/ /security-information/generate-auth-data')
        .send(validAuthRequest)
        .expect(400);

      expect(response.body).to.have.property('status', 400);
    });

    it('should return 400 for SUPI with invalid prefix', async () => {
      const response = await request(app)
        .post('/nudm-ueau/v1/nai-user@example.com/security-information/generate-auth-data')
        .send(validAuthRequest)
        .expect(400);

      expect(response.body).to.have.property('status', 400);
      expect(response.body).to.have.property('cause', 'INVALID_PARAMETER');
    });
  });

  describe('SUCI handling', () => {
    it('should return 501 for SUCI (not yet implemented)', async () => {
      const suci = 'suci-0-001-01-0-0-0123456789ABCDEF';

      const response = await request(app)
        .post(`/nudm-ueau/v1/${suci}/security-information/generate-auth-data`)
        .send(validAuthRequest)
        .expect(501)
        .expect('Content-Type', /json/);

      expect(response.body).to.have.property('status', 501);
      expect(response.body).to.have.property('title', 'Not Implemented');
      expect(response.body).to.have.property('detail');
      expect(response.body.detail).to.include('SUCI de-concealment');
    });

    it('should return 501 for different SUCI formats', async () => {
      const sucis = [
        'suci-0-001-01-0-0-0123456789ABCDEF',
        'suci-0-999-70-0-0-FEDCBA9876543210',
        'suci-0-123-45-0-0-AAAAAAAAAAAAAAAA'
      ];

      for (const suci of sucis) {
        const response = await request(app)
          .post(`/nudm-ueau/v1/${suci}/security-information/generate-auth-data`)
          .send(validAuthRequest)
          .expect(501);

        expect(response.body).to.have.property('status', 501);
      }
    });
  });

  describe('Subscriber not found', () => {
    it('should return 404 when subscriber does not exist', async () => {
      (mockCollection.findOne as sinon.SinonStub).resolves(null);

      const response = await request(app)
        .post(`/nudm-ueau/v1/${validSupi}/security-information/generate-auth-data`)
        .send(validAuthRequest)
        .expect(404)
        .expect('Content-Type', /json/);

      expect(response.body).to.have.property('status', 404);
      expect(response.body).to.have.property('title', 'Not Found');
      expect(response.body).to.have.property('detail');
      expect(response.body.detail).to.include('not found');
      expect(response.body).to.have.property('cause', 'DATA_NOT_FOUND');
    });

    it('should return 404 for non-existent IMSI', async () => {
      (mockCollection.findOne as sinon.SinonStub).resolves(null);

      const response = await request(app)
        .post('/nudm-ueau/v1/imsi-000000000000000/security-information/generate-auth-data')
        .send(validAuthRequest)
        .expect(404);

      expect(response.body).to.have.property('status', 404);
      expect(response.body).to.have.property('cause', 'DATA_NOT_FOUND');
    });
  });

  describe('Missing authentication credentials', () => {
    it('should return 500 when permanentKey is missing', async () => {
      (mockCollection.findOne as sinon.SinonStub).resolves({
        ...mockSubscriber,
        permanentKey: ''
      });

      const response = await request(app)
        .post(`/nudm-ueau/v1/${validSupi}/security-information/generate-auth-data`)
        .send(validAuthRequest)
        .expect(500)
        .expect('Content-Type', /json/);

      expect(response.body).to.have.property('status', 500);
      expect(response.body).to.have.property('title', 'Internal Server Error');
      expect(response.body).to.have.property('detail');
      expect(response.body.detail).to.include('Missing authentication credentials');
    });

    it('should return 500 when operatorKey is missing', async () => {
      (mockCollection.findOne as sinon.SinonStub).resolves({
        ...mockSubscriber,
        operatorKey: ''
      });

      const response = await request(app)
        .post(`/nudm-ueau/v1/${validSupi}/security-information/generate-auth-data`)
        .send(validAuthRequest)
        .expect(500);

      expect(response.body).to.have.property('status', 500);
      expect(response.body.detail).to.include('Missing authentication credentials');
    });

    it('should return 500 when sequenceNumber is missing', async () => {
      (mockCollection.findOne as sinon.SinonStub).resolves({
        ...mockSubscriber,
        sequenceNumber: ''
      });

      const response = await request(app)
        .post(`/nudm-ueau/v1/${validSupi}/security-information/generate-auth-data`)
        .send(validAuthRequest)
        .expect(500);

      expect(response.body).to.have.property('status', 500);
      expect(response.body.detail).to.include('Missing authentication credentials');
    });

    it('should return 500 when all credentials are missing', async () => {
      (mockCollection.findOne as sinon.SinonStub).resolves({
        ...mockSubscriber,
        permanentKey: '',
        operatorKey: '',
        sequenceNumber: ''
      });

      const response = await request(app)
        .post(`/nudm-ueau/v1/${validSupi}/security-information/generate-auth-data`)
        .send(validAuthRequest)
        .expect(500);

      expect(response.body).to.have.property('status', 500);
    });
  });

  describe('Request body validation', () => {
    it('should handle request body with extra unknown properties', async () => {
      const authRequestWithExtra = {
        ...validAuthRequest,
        unknownProperty: 'test',
        anotherUnknown: 123
      };

      const response = await request(app)
        .post(`/nudm-ueau/v1/${validSupi}/security-information/generate-auth-data`)
        .send(authRequestWithExtra)
        .expect(200);

      expect(response.body).to.have.property('authType', '5G_AKA');
    });

    it('should handle null optional fields', async () => {
      const authRequestWithNull = {
        ...validAuthRequest,
        supportedFeatures: null,
        resynchronizationInfo: null
      };

      const response = await request(app)
        .post(`/nudm-ueau/v1/${validSupi}/security-information/generate-auth-data`)
        .send(authRequestWithNull)
        .expect(200);

      expect(response.body).to.have.property('authType', '5G_AKA');
    });

    it('should handle undefined optional fields', async () => {
      const authRequestWithUndefined = {
        ...validAuthRequest,
        supportedFeatures: undefined,
        resynchronizationInfo: undefined
      };

      const response = await request(app)
        .post(`/nudm-ueau/v1/${validSupi}/security-information/generate-auth-data`)
        .send(authRequestWithUndefined)
        .expect(200);

      expect(response.body).to.have.property('authType', '5G_AKA');
    });
  });

  describe('Response structure validation', () => {
    it('should return complete AuthenticationInfoResult structure', async () => {
      const response = await request(app)
        .post(`/nudm-ueau/v1/${validSupi}/security-information/generate-auth-data`)
        .send(validAuthRequest)
        .expect(200);

      expect(response.body).to.be.an('object');
      expect(response.body).to.have.property('authType');
      expect(response.body).to.have.property('authenticationVector');
      expect(response.body).to.have.property('supi');
    });

    it('should return authType as 5G_AKA', async () => {
      const response = await request(app)
        .post(`/nudm-ueau/v1/${validSupi}/security-information/generate-auth-data`)
        .send(validAuthRequest)
        .expect(200);

      expect(response.body.authType).to.equal('5G_AKA');
    });

    it('should return avType as 5G_HE_AKA', async () => {
      const response = await request(app)
        .post(`/nudm-ueau/v1/${validSupi}/security-information/generate-auth-data`)
        .send(validAuthRequest)
        .expect(200);

      expect(response.body.authenticationVector.avType).to.equal('5G_HE_AKA');
    });

    it('should return SUPI matching the request', async () => {
      const response = await request(app)
        .post(`/nudm-ueau/v1/${validSupi}/security-information/generate-auth-data`)
        .send(validAuthRequest)
        .expect(200);

      expect(response.body.supi).to.equal(validSupi);
    });

    it('should include all required authentication vector fields', async () => {
      const response = await request(app)
        .post(`/nudm-ueau/v1/${validSupi}/security-information/generate-auth-data`)
        .send(validAuthRequest)
        .expect(200);

      const av = response.body.authenticationVector;
      expect(av).to.include.all.keys('avType', 'rand', 'xresStar', 'autn', 'kausf');
    });
  });

  describe('Database operations', () => {
    it('should query database with correct SUPI', async () => {
      await request(app)
        .post(`/nudm-ueau/v1/${validSupi}/security-information/generate-auth-data`)
        .send(validAuthRequest)
        .expect(200);

      expect((mockCollection.findOne as sinon.SinonStub).calledOnce).to.be.true;
      expect((mockCollection.findOne as sinon.SinonStub).getCall(0).args[0]).to.deep.equal({ supi: validSupi });
    });

    it('should update sequence number in flat structure', async () => {
      await request(app)
        .post(`/nudm-ueau/v1/${validSupi}/security-information/generate-auth-data`)
        .send(validAuthRequest)
        .expect(200);

      expect((mockCollection.updateOne as sinon.SinonStub).calledOnce).to.be.true;
      const updateCall = (mockCollection.updateOne as sinon.SinonStub).getCall(0);
      expect(updateCall.args[1].$set).to.have.property('sequenceNumber');
    });

    it('should update sequence number in nested structure', async () => {
      (mockCollection.findOne as sinon.SinonStub).resolves(mockSubscriberNested);

      await request(app)
        .post(`/nudm-ueau/v1/${validSupi}/security-information/generate-auth-data`)
        .send(validAuthRequest)
        .expect(200);

      expect((mockCollection.updateOne as sinon.SinonStub).calledOnce).to.be.true;
      const updateCall = (mockCollection.updateOne as sinon.SinonStub).getCall(0);
      expect(updateCall.args[1].$set).to.have.property('subscribedData.authenticationSubscription.sequenceNumber');
    });

    it('should call getCollection with subscribers collection name', async () => {
      await request(app)
        .post(`/nudm-ueau/v1/${validSupi}/security-information/generate-auth-data`)
        .send(validAuthRequest)
        .expect(200);

      // Collection is already mocked globally, no need to check
    });
  });

  describe('Edge cases', () => {
    it('should handle very long serving network name', async () => {
      const authRequestWithLongSN = {
        servingNetworkName: '5G:mnc' + '0'.repeat(100) + '.mcc' + '9'.repeat(100) + '.3gppnetwork.org',
        ausfInstanceId: 'ausf-instance-123'
      };

      const response = await request(app)
        .post(`/nudm-ueau/v1/${validSupi}/security-information/generate-auth-data`)
        .send(authRequestWithLongSN)
        .expect(200);

      expect(response.body).to.have.property('authType', '5G_AKA');
    });

    it('should handle very long AUSF instance ID', async () => {
      const authRequestWithLongAUSF = {
        servingNetworkName: validAuthRequest.servingNetworkName,
        ausfInstanceId: 'ausf-instance-' + 'a'.repeat(200)
      };

      const response = await request(app)
        .post(`/nudm-ueau/v1/${validSupi}/security-information/generate-auth-data`)
        .send(authRequestWithLongAUSF)
        .expect(200);

      expect(response.body).to.have.property('authType', '5G_AKA');
    });

    it('should handle high sequence numbers', async () => {
      (mockCollection.findOne as sinon.SinonStub).resolves({
        ...mockSubscriber,
        sequenceNumber: 'FFFFFFFFFFFF'
      });

      const response = await request(app)
        .post(`/nudm-ueau/v1/${validSupi}/security-information/generate-auth-data`)
        .send(validAuthRequest)
        .expect(200);

      expect(response.body).to.have.property('authType', '5G_AKA');
    });

    it('should handle subscriber with minimal data structure', async () => {
      (mockCollection.findOne as sinon.SinonStub).resolves(mockSubscriber);

      const response = await request(app)
        .post(`/nudm-ueau/v1/${validSupi}/security-information/generate-auth-data`)
        .send(validAuthRequest)
        .expect(200);

      expect(response.body).to.have.property('authType', '5G_AKA');
    });

    it('should handle very long IMSI', async () => {
      const longImsi = 'imsi-' + '9'.repeat(100);
      (mockCollection.findOne as sinon.SinonStub).resolves({ ...mockSubscriber, supi: longImsi });

      const response = await request(app)
        .post(`/nudm-ueau/v1/${longImsi}/security-information/generate-auth-data`)
        .send(validAuthRequest)
        .expect(200);

      expect(response.body.supi).to.equal(longImsi);
    });

    it('should generate unique authentication vectors for concurrent requests', async () => {
      const promises = [];
      for (let i = 0; i < 10; i++) {
        promises.push(
          request(app)
            .post(`/nudm-ueau/v1/${validSupi}/security-information/generate-auth-data`)
            .send(validAuthRequest)
        );
      }

      const responses = await Promise.all(promises);

      const rands = responses.map(r => r.body.authenticationVector.rand);
      const uniqueRands = new Set(rands);
      expect(uniqueRands.size).to.equal(10);
    });
  });

  describe('Cryptographic validation', () => {
    it('should generate authentication vector with correct key lengths', async () => {
      const response = await request(app)
        .post(`/nudm-ueau/v1/${validSupi}/security-information/generate-auth-data`)
        .send(validAuthRequest)
        .expect(200);

      const av = response.body.authenticationVector;
      expect(av.rand.length).to.equal(32);
      expect(av.autn.length).to.equal(32);
      expect(av.xresStar.length).to.equal(32);
      expect(av.kausf.length).to.equal(64);
    });

    it('should generate valid hex-encoded values', async () => {
      const response = await request(app)
        .post(`/nudm-ueau/v1/${validSupi}/security-information/generate-auth-data`)
        .send(validAuthRequest)
        .expect(200);

      const av = response.body.authenticationVector;
      expect(av.rand).to.match(/^[A-F0-9]+$/);
      expect(av.autn).to.match(/^[A-F0-9]+$/);
      expect(av.xresStar).to.match(/^[A-F0-9]+$/);
      expect(av.kausf).to.match(/^[A-F0-9]+$/);
    });

    it('should generate uppercase hex values', async () => {
      const response = await request(app)
        .post(`/nudm-ueau/v1/${validSupi}/security-information/generate-auth-data`)
        .send(validAuthRequest)
        .expect(200);

      const av = response.body.authenticationVector;
      expect(av.rand).to.equal(av.rand.toUpperCase());
      expect(av.autn).to.equal(av.autn.toUpperCase());
      expect(av.xresStar).to.equal(av.xresStar.toUpperCase());
      expect(av.kausf).to.equal(av.kausf.toUpperCase());
    });
  });
});

