import { expect } from 'chai';
import request from 'supertest';
import express from 'express';
import router from './nudm-rsds';

const app = express();
app.use(express.json());
app.use('/nudm-rsds/v1', router);

describe('POST /:ueIdentity/sm-delivery-status', () => {
  const validMsisdn = 'msisdn-1234567890';
  const validSmDeliveryStatus = {
    gpsi: 'msisdn-1234567890',
    smStatusReport: 'delivered'
  };

  describe('Success cases', () => {
    it('should report SM delivery status with valid msisdn format', async () => {
      await request(app)
        .post(`/nudm-rsds/v1/${validMsisdn}/sm-delivery-status`)
        .send(validSmDeliveryStatus)
        .expect(204);
    });

    it('should accept external ID format', async () => {
      const extId = 'extid-user@example.com';
      const smStatus = {
        gpsi: 'msisdn-1234567890',
        smStatusReport: 'delivered'
      };
      
      await request(app)
        .post(`/nudm-rsds/v1/${extId}/sm-delivery-status`)
        .send(smStatus)
        .expect(204);
    });

    it('should accept external group ID format', async () => {
      const extGroupId = 'extgroupid-group@example.com';
      const smStatus = {
        gpsi: 'msisdn-9876543210',
        smStatusReport: 'failed'
      };
      
      await request(app)
        .post(`/nudm-rsds/v1/${extGroupId}/sm-delivery-status`)
        .send(smStatus)
        .expect(204);
    });

    it('should handle failedServingNodes optional field', async () => {
      const smStatusWithFailedNodes = {
        gpsi: 'msisdn-1234567890',
        smStatusReport: 'failed',
        failedServingNodes: {
          servedGummei: {
            plmnId: {
              mcc: '001',
              mnc: '01'
            },
            mmegi: '1234',
            mmec: '56'
          },
          servedGuami: {
            plmnId: {
              mcc: '001',
              mnc: '01'
            },
            amfId: '010001'
          }
        }
      };
      
      await request(app)
        .post(`/nudm-rsds/v1/${validMsisdn}/sm-delivery-status`)
        .send(smStatusWithFailedNodes)
        .expect(204);
    });

    it('should handle minimum valid msisdn length', async () => {
      await request(app)
        .post('/nudm-rsds/v1/msisdn-12345/sm-delivery-status')
        .send(validSmDeliveryStatus)
        .expect(204);
    });

    it('should handle maximum valid msisdn length', async () => {
      await request(app)
        .post('/nudm-rsds/v1/msisdn-123456789012345/sm-delivery-status')
        .send(validSmDeliveryStatus)
        .expect(204);
    });

    it('should accept various smStatusReport values', async () => {
      const statusReports = ['delivered', 'failed', 'pending', 'expired', 'rejected'];

      for (const status of statusReports) {
        const smStatus = {
          gpsi: 'msisdn-1234567890',
          smStatusReport: status
        };
        
        await request(app)
          .post(`/nudm-rsds/v1/${validMsisdn}/sm-delivery-status`)
          .send(smStatus)
          .expect(204);
      }
    });

    it('should accept different gpsi formats', async () => {
      const gpsiFormats = [
        'msisdn-1234567890',
        'msisdn-9876543210',
        'msisdn-555123456789'
      ];

      for (const gpsi of gpsiFormats) {
        const smStatus = {
          gpsi: gpsi,
          smStatusReport: 'delivered'
        };
        
        await request(app)
          .post(`/nudm-rsds/v1/${validMsisdn}/sm-delivery-status`)
          .send(smStatus)
          .expect(204);
      }
    });

    it('should handle multiple reports for different UEs', async () => {
      const ue1 = 'msisdn-1111111111';
      const ue2 = 'msisdn-2222222222';
      const ue3 = 'extid-user@example.com';

      await request(app)
        .post(`/nudm-rsds/v1/${ue1}/sm-delivery-status`)
        .send(validSmDeliveryStatus)
        .expect(204);

      await request(app)
        .post(`/nudm-rsds/v1/${ue2}/sm-delivery-status`)
        .send(validSmDeliveryStatus)
        .expect(204);

      await request(app)
        .post(`/nudm-rsds/v1/${ue3}/sm-delivery-status`)
        .send(validSmDeliveryStatus)
        .expect(204);
    });

    it('should handle repeated reports for same UE', async () => {
      await request(app)
        .post(`/nudm-rsds/v1/${validMsisdn}/sm-delivery-status`)
        .send(validSmDeliveryStatus)
        .expect(204);

      await request(app)
        .post(`/nudm-rsds/v1/${validMsisdn}/sm-delivery-status`)
        .send({
          gpsi: 'msisdn-1234567890',
          smStatusReport: 'delivered-again'
        })
        .expect(204);
    });

    it('should accept catch-all pattern for ueIdentity', async () => {
      const catchAllIds = [
        'anyIdentifier',
        'customId123',
        'special-id-format'
      ];

      for (const id of catchAllIds) {
        await request(app)
          .post(`/nudm-rsds/v1/${id}/sm-delivery-status`)
          .send(validSmDeliveryStatus)
          .expect(204);
      }
    });
  });

  describe('Validation error cases - ueIdentity', () => {
    it('should return 400 for msisdn with too short number', async () => {
      const response = await request(app)
        .post('/nudm-rsds/v1/msisdn-1234/sm-delivery-status')
        .send(validSmDeliveryStatus)
        .expect(400)
        .expect('Content-Type', /json/);

      expect(response.body).to.have.property('status', 400);
      expect(response.body).to.have.property('title', 'Bad Request');
      expect(response.body).to.have.property('detail');
      expect(response.body.detail).to.include('ueIdentity');
      expect(response.body).to.have.property('cause', 'INVALID_PARAMETER');
    });

    it('should return 400 for msisdn with too long number', async () => {
      const response = await request(app)
        .post('/nudm-rsds/v1/msisdn-1234567890123456/sm-delivery-status')
        .send(validSmDeliveryStatus)
        .expect(400);

      expect(response.body).to.have.property('status', 400);
      expect(response.body).to.have.property('cause', 'INVALID_PARAMETER');
    });

    it('should return 400 for msisdn with non-numeric characters', async () => {
      const response = await request(app)
        .post('/nudm-rsds/v1/msisdn-12345abcde/sm-delivery-status')
        .send(validSmDeliveryStatus)
        .expect(400);

      expect(response.body).to.have.property('status', 400);
      expect(response.body).to.have.property('cause', 'INVALID_PARAMETER');
    });

    it('should return 400 for extid without @ symbol', async () => {
      const response = await request(app)
        .post('/nudm-rsds/v1/extid-userexample.com/sm-delivery-status')
        .send(validSmDeliveryStatus)
        .expect(400);

      expect(response.body).to.have.property('status', 400);
      expect(response.body).to.have.property('cause', 'INVALID_PARAMETER');
    });

    it('should return 400 for extgroupid without @ symbol', async () => {
      const response = await request(app)
        .post('/nudm-rsds/v1/extgroupid-groupexample.com/sm-delivery-status')
        .send(validSmDeliveryStatus)
        .expect(400);

      expect(response.body).to.have.property('status', 400);
      expect(response.body).to.have.property('cause', 'INVALID_PARAMETER');
    });

    it('should return 400 for empty ueIdentity', async () => {
      const response = await request(app)
        .post('/nudm-rsds/v1/ /sm-delivery-status')
        .send(validSmDeliveryStatus)
        .expect(400);

      expect(response.body).to.have.property('status', 400);
    });
  });

  describe('Validation error cases - missing required fields', () => {
    it('should return 400 when gpsi is missing', async () => {
      const smStatusWithoutGpsi = {
        smStatusReport: 'delivered'
      };

      const response = await request(app)
        .post(`/nudm-rsds/v1/${validMsisdn}/sm-delivery-status`)
        .send(smStatusWithoutGpsi)
        .expect(400)
        .expect('Content-Type', /json/);

      expect(response.body).to.have.property('status', 400);
      expect(response.body).to.have.property('title', 'Bad Request');
      expect(response.body).to.have.property('detail');
      expect(response.body.detail).to.include('gpsi');
      expect(response.body).to.have.property('cause', 'INVALID_PARAMETER');
    });

    it('should return 400 when smStatusReport is missing', async () => {
      const smStatusWithoutReport = {
        gpsi: 'msisdn-1234567890'
      };

      const response = await request(app)
        .post(`/nudm-rsds/v1/${validMsisdn}/sm-delivery-status`)
        .send(smStatusWithoutReport)
        .expect(400);

      expect(response.body).to.have.property('status', 400);
      expect(response.body).to.have.property('detail');
      expect(response.body.detail).to.include('smStatusReport');
      expect(response.body).to.have.property('cause', 'INVALID_PARAMETER');
    });

    it('should return 400 when all required fields are missing', async () => {
      const response = await request(app)
        .post(`/nudm-rsds/v1/${validMsisdn}/sm-delivery-status`)
        .send({})
        .expect(400);

      expect(response.body).to.have.property('status', 400);
      expect(response.body).to.have.property('cause', 'INVALID_PARAMETER');
    });

    it('should return 400 when request body is an array', async () => {
      const response = await request(app)
        .post(`/nudm-rsds/v1/${validMsisdn}/sm-delivery-status`)
        .send([validSmDeliveryStatus])
        .expect(400);

      expect(response.body).to.have.property('status', 400);
      expect(response.body).to.have.property('cause', 'INVALID_PARAMETER');
    });

    it('should return 400 when gpsi is not a string', async () => {
      const smStatusWithInvalidGpsi = {
        gpsi: 12345,
        smStatusReport: 'delivered'
      };

      const response = await request(app)
        .post(`/nudm-rsds/v1/${validMsisdn}/sm-delivery-status`)
        .send(smStatusWithInvalidGpsi)
        .expect(400);

      expect(response.body).to.have.property('status', 400);
      expect(response.body).to.have.property('detail');
      expect(response.body.detail).to.include('gpsi');
      expect(response.body).to.have.property('cause', 'INVALID_PARAMETER');
    });

    it('should return 400 when smStatusReport is not a string', async () => {
      const smStatusWithInvalidReport = {
        gpsi: 'msisdn-1234567890',
        smStatusReport: 123
      };

      const response = await request(app)
        .post(`/nudm-rsds/v1/${validMsisdn}/sm-delivery-status`)
        .send(smStatusWithInvalidReport)
        .expect(400);

      expect(response.body).to.have.property('status', 400);
      expect(response.body).to.have.property('detail');
      expect(response.body.detail).to.include('smStatusReport');
      expect(response.body).to.have.property('cause', 'INVALID_PARAMETER');
    });

    it('should return 400 when gpsi is empty string', async () => {
      const smStatusWithEmptyGpsi = {
        gpsi: '',
        smStatusReport: 'delivered'
      };

      const response = await request(app)
        .post(`/nudm-rsds/v1/${validMsisdn}/sm-delivery-status`)
        .send(smStatusWithEmptyGpsi)
        .expect(400);

      expect(response.body).to.have.property('status', 400);
      expect(response.body).to.have.property('cause', 'INVALID_PARAMETER');
    });

    it('should return 400 when smStatusReport is empty string', async () => {
      const smStatusWithEmptyReport = {
        gpsi: 'msisdn-1234567890',
        smStatusReport: ''
      };

      const response = await request(app)
        .post(`/nudm-rsds/v1/${validMsisdn}/sm-delivery-status`)
        .send(smStatusWithEmptyReport)
        .expect(400);

      expect(response.body).to.have.property('status', 400);
      expect(response.body).to.have.property('cause', 'INVALID_PARAMETER');
    });

    it('should return 400 when gpsi is null', async () => {
      const smStatusWithNullGpsi = {
        gpsi: null,
        smStatusReport: 'delivered'
      };

      const response = await request(app)
        .post(`/nudm-rsds/v1/${validMsisdn}/sm-delivery-status`)
        .send(smStatusWithNullGpsi)
        .expect(400);

      expect(response.body).to.have.property('status', 400);
      expect(response.body).to.have.property('cause', 'INVALID_PARAMETER');
    });

    it('should return 400 when smStatusReport is null', async () => {
      const smStatusWithNullReport = {
        gpsi: 'msisdn-1234567890',
        smStatusReport: null
      };

      const response = await request(app)
        .post(`/nudm-rsds/v1/${validMsisdn}/sm-delivery-status`)
        .send(smStatusWithNullReport)
        .expect(400);

      expect(response.body).to.have.property('status', 400);
      expect(response.body).to.have.property('cause', 'INVALID_PARAMETER');
    });
  });

  describe('Request body validation', () => {
    it('should handle request body with extra unknown properties', async () => {
      const smStatusWithExtra = {
        ...validSmDeliveryStatus,
        unknownProperty: 'test',
        anotherUnknown: 123
      };

      await request(app)
        .post(`/nudm-rsds/v1/${validMsisdn}/sm-delivery-status`)
        .send(smStatusWithExtra)
        .expect(204);
    });

    it('should return 400 when body is undefined', async () => {
      const response = await request(app)
        .post(`/nudm-rsds/v1/${validMsisdn}/sm-delivery-status`)
        .expect(400);

      expect(response.body).to.have.property('status', 400);
      expect(response.body).to.have.property('cause', 'INVALID_PARAMETER');
    });

    it('should handle valid failedServingNodes structure', async () => {
      const smStatusWithFailedNodes = {
        gpsi: 'msisdn-1234567890',
        smStatusReport: 'failed',
        failedServingNodes: {
          servedGummei: {
            plmnId: {
              mcc: '001',
              mnc: '01'
            }
          }
        }
      };

      await request(app)
        .post(`/nudm-rsds/v1/${validMsisdn}/sm-delivery-status`)
        .send(smStatusWithFailedNodes)
        .expect(204);
    });
  });

  describe('Edge cases', () => {
    it('should handle very long external ID', async () => {
      const longExtId = 'extid-' + 'a'.repeat(100) + '@example.com';
      await request(app)
        .post(`/nudm-rsds/v1/${longExtId}/sm-delivery-status`)
        .send(validSmDeliveryStatus)
        .expect(204);
    });

    it('should handle external ID with special characters', async () => {
      const specialExtId = 'extid-user.name+test@example.co.uk';
      await request(app)
        .post(`/nudm-rsds/v1/${specialExtId}/sm-delivery-status`)
        .send(validSmDeliveryStatus)
        .expect(204);
    });

    it('should handle external group ID with subdomain', async () => {
      const groupId = 'extgroupid-group123@subdomain.example.com';
      await request(app)
        .post(`/nudm-rsds/v1/${groupId}/sm-delivery-status`)
        .send(validSmDeliveryStatus)
        .expect(204);
    });

    it('should handle very long smStatusReport value', async () => {
      const smStatusWithLongReport = {
        gpsi: 'msisdn-1234567890',
        smStatusReport: 'a'.repeat(500)
      };

      await request(app)
        .post(`/nudm-rsds/v1/${validMsisdn}/sm-delivery-status`)
        .send(smStatusWithLongReport)
        .expect(204);
    });

    it('should handle very long gpsi value', async () => {
      const smStatusWithLongGpsi = {
        gpsi: 'msisdn-' + '1'.repeat(100),
        smStatusReport: 'delivered'
      };

      await request(app)
        .post(`/nudm-rsds/v1/${validMsisdn}/sm-delivery-status`)
        .send(smStatusWithLongGpsi)
        .expect(204);
    });

    it('should handle different msisdn formats from different countries', async () => {
      const countryCodes = ['12345678901', '9876543210', '555123456789'];

      for (const code of countryCodes) {
        await request(app)
          .post(`/nudm-rsds/v1/msisdn-${code}/sm-delivery-status`)
          .send(validSmDeliveryStatus)
          .expect(204);
      }
    });

    it('should handle complex failedServingNodes structure', async () => {
      const smStatusWithComplexFailedNodes = {
        gpsi: 'msisdn-1234567890',
        smStatusReport: 'failed',
        failedServingNodes: {
          servedGummei: {
            plmnId: {
              mcc: '001',
              mnc: '01'
            },
            mmegi: '1234',
            mmec: '56'
          },
          servedGuami: {
            plmnId: {
              mcc: '999',
              mnc: '99'
            },
            amfId: '010001'
          },
          hssDiameterRealm: 'hss.example.com',
          hssDiameterHost: 'hss1.example.com'
        }
      };

      await request(app)
        .post(`/nudm-rsds/v1/${validMsisdn}/sm-delivery-status`)
        .send(smStatusWithComplexFailedNodes)
        .expect(204);
    });

    it('should handle smStatusReport with special characters', async () => {
      const smStatusWithSpecialChars = {
        gpsi: 'msisdn-1234567890',
        smStatusReport: 'status-code_123:failed!@#'
      };

      await request(app)
        .post(`/nudm-rsds/v1/${validMsisdn}/sm-delivery-status`)
        .send(smStatusWithSpecialChars)
        .expect(204);
    });

    it('should handle consecutive requests for same UE', async () => {
      for (let i = 0; i < 5; i++) {
        await request(app)
          .post(`/nudm-rsds/v1/${validMsisdn}/sm-delivery-status`)
          .send({
            gpsi: 'msisdn-1234567890',
            smStatusReport: `delivered-${i}`
          })
          .expect(204);
      }
    });
  });
});
