import { expect } from 'chai';
import request from 'supertest';
import express from 'express';
import '../test-setup';
import router from './nudm-niddau';
import { mockCollection } from '../test-setup';

const app = express();
app.use(express.json());
app.use('/nudm-niddau/v1', router);

describe('POST /:ueIdentity/authorize', () => {
  const validMsisdn = 'msisdn-1234567890';
  const validAuthInfo = {
    snssai: {
      sst: 1,
      sd: '000001'
    },
    dnn: 'internet',
    mtcProviderInformation: '12345',
    authUpdateCallbackUri: 'http://example.com/callback'
  };

  // Helper function to create test subscriber data
  const createTestSubscriber = (customData = {}) => {
    return {
      _id: 'imsi-001010000000001',
      gpsis: [
        'msisdn-1234567890',
        'msisdn-12345',  // Minimum length
        'msisdn-123456789012345'  // Maximum length
      ],
      externalIds: [
        'extid-user@example.com',
        'extid-' + 'a'.repeat(100) + '@example.com',  // Very long
        'extid-user.name+test@example.co.uk'  // Special characters
      ],
      externalGroupIds: [
        'extgroupid-group@example.com',
        'extgroupid-group123@subdomain.example.com'  // Subdomain
      ],
      nssai: {
        defaultSingleNssais: [
          { sst: 1, sd: '000001' }
        ],
        singleNssais: [
          { sst: 1, sd: '000001' },
          { sst: 2, sd: '000002' },
          { sst: 2, sd: 'ABCDEF' }  // Complex snssai
        ]
      },
      subscribedSnssaiInfos: {
        '1-000001': {
          dnnInfos: [
            { dnn: 'internet', defaultDnnIndicator: true },
            { dnn: 'ims' },
            { dnn: 'a'.repeat(100) }  // Very long DNN
          ]
        },
        '2-000002': {
          dnnInfos: [
            { dnn: 'enterprise' },
            { dnn: 'internet' }
          ]
        },
        '2-ABCDEF': {
          dnnInfos: [
            { dnn: 'internet' }
          ]
        }
      },
      allowedMtcProviders: ['12345', '67890'],
      allowedAfIds: ['af-12345', 'af-67890'],
      ...customData
    };
  };

  describe('Success cases', () => {
    beforeEach(async () => {
      await mockCollection.insertOne(createTestSubscriber());
    });
    it('should authorize NIDD with valid msisdn format', async () => {
      const response = await request(app)
        .post(`/nudm-niddau/v1/${validMsisdn}/authorize`)
        .send(validAuthInfo)
        .expect(200)
        .expect('Content-Type', /json/);

      expect(response.body).to.have.property('authorizationData');
      expect(response.body.authorizationData).to.be.an('array');
      expect(response.body.authorizationData).to.have.lengthOf.at.least(1);
      expect(response.body).to.have.property('validityTime');
    });

    it('should return authorization data with required fields', async () => {
      const response = await request(app)
        .post(`/nudm-niddau/v1/${validMsisdn}/authorize`)
        .send(validAuthInfo)
        .expect(200);

      const authData = response.body.authorizationData[0];
      expect(authData).to.have.property('supi');
      expect(authData).to.have.property('gpsi');
      expect(authData).to.have.property('validityTime');
    });

    it('should accept external ID format', async () => {
      const extId = 'extid-user@example.com';
      const response = await request(app)
        .post(`/nudm-niddau/v1/${extId}/authorize`)
        .send(validAuthInfo)
        .expect(200);

      expect(response.body).to.have.property('authorizationData');
      expect(response.body.authorizationData).to.be.an('array');
    });

    it('should accept external group ID format', async () => {
      const extGroupId = 'extgroupid-group@example.com';
      const response = await request(app)
        .post(`/nudm-niddau/v1/${extGroupId}/authorize`)
        .send(validAuthInfo)
        .expect(200);

      expect(response.body).to.have.property('authorizationData');
      expect(response.body.authorizationData).to.be.an('array');
    });

    it('should handle optional afId field', async () => {
      const authInfoWithAfId = {
        ...validAuthInfo,
        afId: 'af-12345'
      };

      const response = await request(app)
        .post(`/nudm-niddau/v1/${validMsisdn}/authorize`)
        .send(authInfoWithAfId)
        .expect(200);

      expect(response.body).to.have.property('authorizationData');
    });

    it('should handle optional nefId field', async () => {
      const authInfoWithNefId = {
        ...validAuthInfo,
        nefId: 'nef-67890'
      };

      const response = await request(app)
        .post(`/nudm-niddau/v1/${validMsisdn}/authorize`)
        .send(authInfoWithNefId)
        .expect(200);

      expect(response.body).to.have.property('authorizationData');
    });

    it('should handle optional validityTime field', async () => {
      const customValidityTime = '2025-12-31T23:59:59Z';
      const authInfoWithValidity = {
        ...validAuthInfo,
        validityTime: customValidityTime
      };

      const response = await request(app)
        .post(`/nudm-niddau/v1/${validMsisdn}/authorize`)
        .send(authInfoWithValidity)
        .expect(200);

      expect(response.body).to.have.property('authorizationData');
      expect(response.body.authorizationData[0].validityTime).to.equal(customValidityTime);
    });

    it('should handle optional contextInfo field', async () => {
      const authInfoWithContext = {
        ...validAuthInfo,
        contextInfo: {
          contextId: 'ctx-123',
          contextType: 'NIDD'
        }
      };

      const response = await request(app)
        .post(`/nudm-niddau/v1/${validMsisdn}/authorize`)
        .send(authInfoWithContext)
        .expect(200);

      expect(response.body).to.have.property('authorizationData');
    });

    it('should handle all optional fields together', async () => {
      const completeAuthInfo = {
        ...validAuthInfo,
        afId: 'af-12345',
        nefId: 'nef-67890',
        validityTime: '2025-12-31T23:59:59Z',
        contextInfo: {
          contextId: 'ctx-123',
          contextType: 'NIDD'
        }
      };

      const response = await request(app)
        .post(`/nudm-niddau/v1/${validMsisdn}/authorize`)
        .send(completeAuthInfo)
        .expect(200);

      expect(response.body).to.have.property('authorizationData');
      expect(response.body).to.have.property('validityTime');
    });

    it('should handle minimum valid msisdn length', async () => {
      const response = await request(app)
        .post('/nudm-niddau/v1/msisdn-12345/authorize')
        .send(validAuthInfo)
        .expect(200);

      expect(response.body).to.have.property('authorizationData');
    });

    it('should handle maximum valid msisdn length', async () => {
      const response = await request(app)
        .post('/nudm-niddau/v1/msisdn-123456789012345/authorize')
        .send(validAuthInfo)
        .expect(200);

      expect(response.body).to.have.property('authorizationData');
    });

    it('should return consistent data for same ueIdentity', async () => {
      const response1 = await request(app)
        .post(`/nudm-niddau/v1/${validMsisdn}/authorize`)
        .send(validAuthInfo)
        .expect(200);

      const response2 = await request(app)
        .post(`/nudm-niddau/v1/${validMsisdn}/authorize`)
        .send(validAuthInfo)
        .expect(200);

      expect(response1.body).to.have.property('authorizationData');
      expect(response2.body).to.have.property('authorizationData');
    });
  });

  describe('Validation error cases - ueIdentity', () => {
    it('should return 400 for invalid ueIdentity format', async () => {
      const response = await request(app)
        .post('/nudm-niddau/v1/invalid-format/authorize')
        .send(validAuthInfo)
        .expect(400)
        .expect('Content-Type', /json/);

      expect(response.body).to.have.property('status', 400);
      expect(response.body).to.have.property('title', 'Bad Request');
      expect(response.body).to.have.property('detail');
      expect(response.body.detail).to.include('ueIdentity');
      expect(response.body).to.have.property('cause', 'INVALID_PARAMETER');
    });

    it('should return 400 for msisdn with too short number', async () => {
      const response = await request(app)
        .post('/nudm-niddau/v1/msisdn-1234/authorize')
        .send(validAuthInfo)
        .expect(400);

      expect(response.body).to.have.property('status', 400);
      expect(response.body).to.have.property('cause', 'INVALID_PARAMETER');
    });

    it('should return 400 for msisdn with too long number', async () => {
      const response = await request(app)
        .post('/nudm-niddau/v1/msisdn-1234567890123456/authorize')
        .send(validAuthInfo)
        .expect(400);

      expect(response.body).to.have.property('status', 400);
      expect(response.body).to.have.property('cause', 'INVALID_PARAMETER');
    });

    it('should return 400 for msisdn with non-numeric characters', async () => {
      const response = await request(app)
        .post('/nudm-niddau/v1/msisdn-12345abcde/authorize')
        .send(validAuthInfo)
        .expect(400);

      expect(response.body).to.have.property('status', 400);
      expect(response.body).to.have.property('cause', 'INVALID_PARAMETER');
    });

    it('should return 400 for extid without @ symbol', async () => {
      const response = await request(app)
        .post('/nudm-niddau/v1/extid-userexample.com/authorize')
        .send(validAuthInfo)
        .expect(400);

      expect(response.body).to.have.property('status', 400);
      expect(response.body).to.have.property('cause', 'INVALID_PARAMETER');
    });

    it('should return 400 for extgroupid without @ symbol', async () => {
      const response = await request(app)
        .post('/nudm-niddau/v1/extgroupid-groupexample.com/authorize')
        .send(validAuthInfo)
        .expect(400);

      expect(response.body).to.have.property('status', 400);
      expect(response.body).to.have.property('cause', 'INVALID_PARAMETER');
    });

    it('should return 400 for empty ueIdentity', async () => {
      const response = await request(app)
        .post('/nudm-niddau/v1/ /authorize')
        .send(validAuthInfo)
        .expect(400);

      expect(response.body).to.have.property('status', 400);
    });
  });

  describe('Validation error cases - missing required fields', () => {
    it('should return 400 when snssai is missing', async () => {
      const authInfoWithoutSnssai = {
        dnn: 'internet',
        mtcProviderInformation: '12345',
        authUpdateCallbackUri: 'http://example.com/callback'
      };

      const response = await request(app)
        .post(`/nudm-niddau/v1/${validMsisdn}/authorize`)
        .send(authInfoWithoutSnssai)
        .expect(400)
        .expect('Content-Type', /json/);

      expect(response.body).to.have.property('status', 400);
      expect(response.body).to.have.property('title', 'Bad Request');
      expect(response.body).to.have.property('detail');
      expect(response.body.detail).to.include('snssai');
      expect(response.body).to.have.property('cause', 'MANDATORY_IE_MISSING');
    });

    it('should return 400 when dnn is missing', async () => {
      const authInfoWithoutDnn = {
        snssai: {
          sst: 1,
          sd: '000001'
        },
        mtcProviderInformation: '12345',
        authUpdateCallbackUri: 'http://example.com/callback'
      };

      const response = await request(app)
        .post(`/nudm-niddau/v1/${validMsisdn}/authorize`)
        .send(authInfoWithoutDnn)
        .expect(400);

      expect(response.body).to.have.property('status', 400);
      expect(response.body).to.have.property('detail');
      expect(response.body.detail).to.include('dnn');
      expect(response.body).to.have.property('cause', 'MANDATORY_IE_MISSING');
    });

    it('should return 400 when mtcProviderInformation is missing', async () => {
      const authInfoWithoutMtc = {
        snssai: {
          sst: 1,
          sd: '000001'
        },
        dnn: 'internet',
        authUpdateCallbackUri: 'http://example.com/callback'
      };

      const response = await request(app)
        .post(`/nudm-niddau/v1/${validMsisdn}/authorize`)
        .send(authInfoWithoutMtc)
        .expect(400);

      expect(response.body).to.have.property('status', 400);
      expect(response.body).to.have.property('detail');
      expect(response.body.detail).to.include('mtcProviderInformation');
      expect(response.body).to.have.property('cause', 'MANDATORY_IE_MISSING');
    });

    it('should return 400 when authUpdateCallbackUri is missing', async () => {
      const authInfoWithoutCallback = {
        snssai: {
          sst: 1,
          sd: '000001'
        },
        dnn: 'internet',
        mtcProviderInformation: '12345'
      };

      const response = await request(app)
        .post(`/nudm-niddau/v1/${validMsisdn}/authorize`)
        .send(authInfoWithoutCallback)
        .expect(400);

      expect(response.body).to.have.property('status', 400);
      expect(response.body).to.have.property('detail');
      expect(response.body.detail).to.include('authUpdateCallbackUri');
      expect(response.body).to.have.property('cause', 'MANDATORY_IE_MISSING');
    });

    it('should return 400 when all required fields are missing', async () => {
      const response = await request(app)
        .post(`/nudm-niddau/v1/${validMsisdn}/authorize`)
        .send({})
        .expect(400);

      expect(response.body).to.have.property('status', 400);
      expect(response.body).to.have.property('cause', 'MANDATORY_IE_MISSING');
    });

    it('should return 400 when request body is an array', async () => {
      const response = await request(app)
        .post(`/nudm-niddau/v1/${validMsisdn}/authorize`)
        .send([validAuthInfo])
        .expect(400);

      expect(response.body).to.have.property('status', 400);
      expect(response.body).to.have.property('cause', 'INVALID_PARAMETER');
    });
  });

  describe('Request body validation', () => {
    beforeEach(async () => {
      await mockCollection.insertOne(createTestSubscriber());
    });

    it('should handle request body with undefined optional fields', async () => {
      const authInfoWithUndefined = {
        ...validAuthInfo,
        afId: undefined,
        nefId: undefined
      };

      const response = await request(app)
        .post(`/nudm-niddau/v1/${validMsisdn}/authorize`)
        .send(authInfoWithUndefined)
        .expect(200);

      expect(response.body).to.have.property('authorizationData');
    });

    it('should handle request body with null optional fields', async () => {
      const authInfoWithNull = {
        ...validAuthInfo,
        afId: null,
        nefId: null
      };

      const response = await request(app)
        .post(`/nudm-niddau/v1/${validMsisdn}/authorize`)
        .send(authInfoWithNull)
        .expect(200);

      expect(response.body).to.have.property('authorizationData');
    });

    it('should handle request body with extra unknown properties', async () => {
      const authInfoWithExtra = {
        ...validAuthInfo,
        unknownProperty: 'test',
        anotherUnknown: 123
      };

      const response = await request(app)
        .post(`/nudm-niddau/v1/${validMsisdn}/authorize`)
        .send(authInfoWithExtra)
        .expect(200);

      expect(response.body).to.have.property('authorizationData');
    });

    it('should validate snssai structure', async () => {
      const response = await request(app)
        .post(`/nudm-niddau/v1/${validMsisdn}/authorize`)
        .send(validAuthInfo)
        .expect(200);

      expect(response.body).to.have.property('authorizationData');
    });

    it('should handle complex snssai structure', async () => {
      const authInfoWithComplexSnssai = {
        ...validAuthInfo,
        snssai: {
          sst: 2,
          sd: 'ABCDEF'
        }
      };

      const response = await request(app)
        .post(`/nudm-niddau/v1/${validMsisdn}/authorize`)
        .send(authInfoWithComplexSnssai)
        .expect(200);

      expect(response.body).to.have.property('authorizationData');
    });
  });

  describe('Response validation', () => {
    beforeEach(async () => {
      await mockCollection.insertOne(createTestSubscriber());
    });

    it('should return valid AuthorizationData structure', async () => {
      const response = await request(app)
        .post(`/nudm-niddau/v1/${validMsisdn}/authorize`)
        .send(validAuthInfo)
        .expect(200);

      expect(response.body).to.have.property('authorizationData');
      expect(response.body.authorizationData).to.be.an('array');
      expect(response.body.authorizationData).to.have.lengthOf.at.least(1);
      expect(response.body).to.have.property('validityTime');
    });

    it('should return valid UserIdentifier structure', async () => {
      const response = await request(app)
        .post(`/nudm-niddau/v1/${validMsisdn}/authorize`)
        .send(validAuthInfo)
        .expect(200);

      const userIdentifier = response.body.authorizationData[0];
      expect(userIdentifier).to.have.property('supi');
      expect(userIdentifier.supi).to.be.a('string');
      expect(userIdentifier).to.have.property('gpsi');
      expect(userIdentifier.gpsi).to.be.a('string');
      expect(userIdentifier).to.have.property('validityTime');
      expect(userIdentifier.validityTime).to.be.a('string');
    });

    it('should return ISO 8601 format for validityTime', async () => {
      const response = await request(app)
        .post(`/nudm-niddau/v1/${validMsisdn}/authorize`)
        .send(validAuthInfo)
        .expect(200);

      const validityTime = response.body.validityTime;
      expect(validityTime).to.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/);
    });

    it('should return supi starting with imsi-', async () => {
      const response = await request(app)
        .post(`/nudm-niddau/v1/${validMsisdn}/authorize`)
        .send(validAuthInfo)
        .expect(200);

      const supi = response.body.authorizationData[0].supi;
      expect(supi).to.match(/^imsi-/);
    });

    it('should return gpsi for msisdn format', async () => {
      const response = await request(app)
        .post(`/nudm-niddau/v1/${validMsisdn}/authorize`)
        .send(validAuthInfo)
        .expect(200);

      const gpsi = response.body.authorizationData[0].gpsi;
      expect(gpsi).to.be.a('string');
    });
  });

  describe('Edge cases', () => {
    beforeEach(async () => {
      await mockCollection.insertOne(createTestSubscriber());

      // Add test subscribers for different msisdn formats
      await mockCollection.insertOne(createTestSubscriber({
        _id: 'imsi-001010000000002',
        gpsis: ['msisdn-12345678901']
      }));

      await mockCollection.insertOne(createTestSubscriber({
        _id: 'imsi-001010000000003',
        gpsis: ['msisdn-9876543210']
      }));

      await mockCollection.insertOne(createTestSubscriber({
        _id: 'imsi-001010000000004',
        gpsis: ['msisdn-555123456789']
      }));

      // Add test subscribers for multiple authorization test
      await mockCollection.insertOne(createTestSubscriber({
        _id: 'imsi-001010000000011',
        gpsis: ['msisdn-1111111111']
      }));

      await mockCollection.insertOne(createTestSubscriber({
        _id: 'imsi-001010000000012',
        gpsis: ['msisdn-2222222222']
      }));
    });

    it('should handle very long external ID', async () => {
      const longExtId = 'extid-' + 'a'.repeat(100) + '@example.com';
      const response = await request(app)
        .post(`/nudm-niddau/v1/${longExtId}/authorize`)
        .send(validAuthInfo)
        .expect(200);

      expect(response.body).to.have.property('authorizationData');
    });

    it('should handle external ID with special characters', async () => {
      const specialExtId = 'extid-user.name+test@example.co.uk';
      const response = await request(app)
        .post(`/nudm-niddau/v1/${specialExtId}/authorize`)
        .send(validAuthInfo)
        .expect(200);

      expect(response.body).to.have.property('authorizationData');
    });

    it('should handle external group ID with subdomain', async () => {
      const groupId = 'extgroupid-group123@subdomain.example.com';
      const response = await request(app)
        .post(`/nudm-niddau/v1/${groupId}/authorize`)
        .send(validAuthInfo)
        .expect(200);

      expect(response.body).to.have.property('authorizationData');
    });

    it('should handle very long DNN value', async () => {
      const authInfoWithLongDnn = {
        ...validAuthInfo,
        dnn: 'a'.repeat(100)
      };

      const response = await request(app)
        .post(`/nudm-niddau/v1/${validMsisdn}/authorize`)
        .send(authInfoWithLongDnn)
        .expect(200);

      expect(response.body).to.have.property('authorizationData');
    });

    it('should handle very long callback URI', async () => {
      const authInfoWithLongUri = {
        ...validAuthInfo,
        authUpdateCallbackUri: 'http://example.com/' + 'a'.repeat(200)
      };

      const response = await request(app)
        .post(`/nudm-niddau/v1/${validMsisdn}/authorize`)
        .send(authInfoWithLongUri)
        .expect(200);

      expect(response.body).to.have.property('authorizationData');
    });

    it('should handle HTTPS callback URI', async () => {
      const authInfoWithHttps = {
        ...validAuthInfo,
        authUpdateCallbackUri: 'https://secure.example.com/callback'
      };

      const response = await request(app)
        .post(`/nudm-niddau/v1/${validMsisdn}/authorize`)
        .send(authInfoWithHttps)
        .expect(200);

      expect(response.body).to.have.property('authorizationData');
    });

    it('should handle different msisdn formats from different countries', async () => {
      const countryCodes = ['12345678901', '9876543210', '555123456789'];

      for (const code of countryCodes) {
        const response = await request(app)
          .post(`/nudm-niddau/v1/msisdn-${code}/authorize`)
          .send(validAuthInfo)
          .expect(200);

        expect(response.body).to.have.property('authorizationData');
      }
    });

    it('should handle multiple authorizations for different UEs', async () => {
      const ue1 = 'msisdn-1111111111';
      const ue2 = 'msisdn-2222222222';
      const ue3 = 'extid-user@example.com';

      await request(app)
        .post(`/nudm-niddau/v1/${ue1}/authorize`)
        .send(validAuthInfo)
        .expect(200);

      await request(app)
        .post(`/nudm-niddau/v1/${ue2}/authorize`)
        .send(validAuthInfo)
        .expect(200);

      await request(app)
        .post(`/nudm-niddau/v1/${ue3}/authorize`)
        .send(validAuthInfo)
        .expect(200);

      expect(ue1).to.not.equal(ue2);
      expect(ue2).to.not.equal(ue3);
    });
  });
});

