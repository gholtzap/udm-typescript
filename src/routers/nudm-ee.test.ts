import { expect } from 'chai';
import request from 'supertest';
import express from 'express';
import router from './nudm-ee';

const app = express();
app.use(express.json());
app.use(express.json({ type: 'application/json-patch+json' }));
app.use('/nudm-ee/v1', router);

describe('POST /:ueIdentity/ee-subscriptions', () => {
  const validUeIdentity = 'imsi-123456789012345';
  const validSubscription = {
    callbackReference: 'http://example.com/callback',
    monitoringConfigurations: {
      '1': {
        eventType: 'LOSS_OF_CONNECTIVITY'
      }
    }
  };

  describe('Success cases', () => {
    it('should create a subscription with valid data', async () => {
      const response = await request(app)
        .post(`/nudm-ee/v1/${validUeIdentity}/ee-subscriptions`)
        .send(validSubscription)
        .expect(201)
        .expect('Content-Type', /json/);

      expect(response.body).to.have.property('eeSubscription');
      expect(response.body.eeSubscription).to.have.property('subscriptionId');
      expect(response.body.eeSubscription.callbackReference).to.equal(validSubscription.callbackReference);
      expect(response.body.eeSubscription.monitoringConfigurations).to.deep.equal(validSubscription.monitoringConfigurations);

      expect(response.headers.location).to.match(
        new RegExp(`/nudm-ee/v1/${validUeIdentity}/ee-subscriptions/[a-f0-9-]+`)
      );
    });

    it('should accept msisdn format for ueIdentity', async () => {
      const response = await request(app)
        .post('/nudm-ee/v1/msisdn-1234567890/ee-subscriptions')
        .send(validSubscription)
        .expect(201);

      expect(response.body.eeSubscription).to.have.property('subscriptionId');
    });

    it('should accept extid format for ueIdentity', async () => {
      const response = await request(app)
        .post('/nudm-ee/v1/extid-user@example.com/ee-subscriptions')
        .send(validSubscription)
        .expect(201);

      expect(response.body.eeSubscription).to.have.property('subscriptionId');
    });

    it('should accept nai format for ueIdentity', async () => {
      const response = await request(app)
        .post('/nudm-ee/v1/nai-user@example.com/ee-subscriptions')
        .send(validSubscription)
        .expect(201);

      expect(response.body.eeSubscription).to.have.property('subscriptionId');
    });

    it('should accept anyUE as ueIdentity', async () => {
      const response = await request(app)
        .post('/nudm-ee/v1/anyUE/ee-subscriptions')
        .send(validSubscription)
        .expect(201);

      expect(response.body.eeSubscription).to.have.property('subscriptionId');
    });

    it('should accept subscription with optional fields', async () => {
      const extendedSubscription = {
        ...validSubscription,
        reportingOptions: {
          reportMode: 'ON_EVENT_DETECTION',
          maxNumOfReports: 10
        },
        supportedFeatures: 'ABC123'
      };

      const response = await request(app)
        .post(`/nudm-ee/v1/${validUeIdentity}/ee-subscriptions`)
        .send(extendedSubscription)
        .expect(201);

      expect(response.body.eeSubscription.reportingOptions).to.deep.equal(extendedSubscription.reportingOptions);
      expect(response.body.eeSubscription.supportedFeatures).to.equal(extendedSubscription.supportedFeatures);
    });

    it('should generate unique subscription IDs', async () => {
      const response1 = await request(app)
        .post(`/nudm-ee/v1/${validUeIdentity}/ee-subscriptions`)
        .send(validSubscription)
        .expect(201);

      const response2 = await request(app)
        .post(`/nudm-ee/v1/${validUeIdentity}/ee-subscriptions`)
        .send(validSubscription)
        .expect(201);

      expect(response1.body.eeSubscription.subscriptionId).to.not.equal(
        response2.body.eeSubscription.subscriptionId
      );
    });
  });

  describe('Validation errors', () => {
    it('should return 400 when callbackReference is missing', async () => {
      const invalidSubscription = {
        monitoringConfigurations: {
          '1': {
            eventType: 'LOSS_OF_CONNECTIVITY'
          }
        }
      };

      const response = await request(app)
        .post(`/nudm-ee/v1/${validUeIdentity}/ee-subscriptions`)
        .send(invalidSubscription)
        .expect(400)
        .expect('Content-Type', /json/);

      expect(response.body).to.have.property('title', 'Bad Request');
      expect(response.body).to.have.property('status', 400);
      expect(response.body.detail).to.include('callbackReference');
    });

    it('should return 400 when monitoringConfigurations is missing', async () => {
      const invalidSubscription = {
        callbackReference: 'http://example.com/callback'
      };

      const response = await request(app)
        .post(`/nudm-ee/v1/${validUeIdentity}/ee-subscriptions`)
        .send(invalidSubscription)
        .expect(400);

      expect(response.body).to.have.property('title', 'Bad Request');
      expect(response.body).to.have.property('status', 400);
      expect(response.body.detail).to.include('monitoringConfigurations');
    });

    it('should return 400 when monitoringConfigurations is empty', async () => {
      const invalidSubscription = {
        callbackReference: 'http://example.com/callback',
        monitoringConfigurations: {}
      };

      const response = await request(app)
        .post(`/nudm-ee/v1/${validUeIdentity}/ee-subscriptions`)
        .send(invalidSubscription)
        .expect(400);

      expect(response.body).to.have.property('title', 'Bad Request');
      expect(response.body.detail).to.include('monitoringConfigurations');
    });

    it('should return 400 for invalid msisdn format (too short)', async () => {
      const response = await request(app)
        .post('/nudm-ee/v1/msisdn-1234/ee-subscriptions')
        .send(validSubscription)
        .expect(400);

      expect(response.body).to.have.property('title', 'Bad Request');
      expect(response.body.detail).to.include('ueIdentity');
    });

    it('should return 400 for invalid msisdn format (too long)', async () => {
      const response = await request(app)
        .post('/nudm-ee/v1/msisdn-1234567890123456/ee-subscriptions')
        .send(validSubscription)
        .expect(400);

      expect(response.body).to.have.property('title', 'Bad Request');
      expect(response.body.detail).to.include('ueIdentity');
    });

    it('should return 400 for invalid msisdn format (non-numeric)', async () => {
      const response = await request(app)
        .post('/nudm-ee/v1/msisdn-abcde/ee-subscriptions')
        .send(validSubscription)
        .expect(400);

      expect(response.body).to.have.property('title', 'Bad Request');
      expect(response.body.detail).to.include('ueIdentity');
    });

    it('should return 400 for invalid imsi format (too short)', async () => {
      const response = await request(app)
        .post('/nudm-ee/v1/imsi-1234/ee-subscriptions')
        .send(validSubscription)
        .expect(400);

      expect(response.body).to.have.property('title', 'Bad Request');
      expect(response.body.detail).to.include('ueIdentity');
    });

    it('should return 400 for invalid extid format (missing @)', async () => {
      const response = await request(app)
        .post('/nudm-ee/v1/extid-userexample.com/ee-subscriptions')
        .send(validSubscription)
        .expect(400);

      expect(response.body).to.have.property('title', 'Bad Request');
      expect(response.body.detail).to.include('ueIdentity');
    });
  });

  describe('Multiple event types', () => {
    it('should accept multiple monitoring configurations', async () => {
      const multiEventSubscription = {
        callbackReference: 'http://example.com/callback',
        monitoringConfigurations: {
          '1': {
            eventType: 'LOSS_OF_CONNECTIVITY'
          },
          '2': {
            eventType: 'UE_REACHABILITY_FOR_DATA'
          },
          '3': {
            eventType: 'LOCATION_REPORTING',
            locationReportingConfiguration: {
              currentLocation: true,
              accuracy: 'CELL_LEVEL'
            }
          }
        }
      };

      const response = await request(app)
        .post(`/nudm-ee/v1/${validUeIdentity}/ee-subscriptions`)
        .send(multiEventSubscription)
        .expect(201);

      expect(Object.keys(response.body.eeSubscription.monitoringConfigurations)).to.have.lengthOf(3);
      expect(response.body.eeSubscription.monitoringConfigurations['3'].locationReportingConfiguration).to.exist;
    });
  });
});

describe('DELETE /:ueIdentity/ee-subscriptions/:subscriptionId', () => {
  const validUeIdentity = 'imsi-123456789012345';
  const validSubscription = {
    callbackReference: 'http://example.com/callback',
    monitoringConfigurations: {
      '1': {
        eventType: 'LOSS_OF_CONNECTIVITY'
      }
    }
  };

  describe('Success cases', () => {
    it('should delete an existing subscription', async () => {
      const createResponse = await request(app)
        .post(`/nudm-ee/v1/${validUeIdentity}/ee-subscriptions`)
        .send(validSubscription)
        .expect(201);

      const subscriptionId = createResponse.body.eeSubscription.subscriptionId;

      await request(app)
        .delete(`/nudm-ee/v1/${validUeIdentity}/ee-subscriptions/${subscriptionId}`)
        .expect(204);
    });

    it('should delete subscription with msisdn format ueIdentity', async () => {
      const ueIdentity = 'msisdn-1234567890';
      const createResponse = await request(app)
        .post(`/nudm-ee/v1/${ueIdentity}/ee-subscriptions`)
        .send(validSubscription)
        .expect(201);

      const subscriptionId = createResponse.body.eeSubscription.subscriptionId;

      await request(app)
        .delete(`/nudm-ee/v1/${ueIdentity}/ee-subscriptions/${subscriptionId}`)
        .expect(204);
    });

    it('should delete subscription with extid format ueIdentity', async () => {
      const ueIdentity = 'extid-user@example.com';
      const createResponse = await request(app)
        .post(`/nudm-ee/v1/${ueIdentity}/ee-subscriptions`)
        .send(validSubscription)
        .expect(201);

      const subscriptionId = createResponse.body.eeSubscription.subscriptionId;

      await request(app)
        .delete(`/nudm-ee/v1/${ueIdentity}/ee-subscriptions/${subscriptionId}`)
        .expect(204);
    });

    it('should delete subscription with anyUE as ueIdentity', async () => {
      const ueIdentity = 'anyUE';
      const createResponse = await request(app)
        .post(`/nudm-ee/v1/${ueIdentity}/ee-subscriptions`)
        .send(validSubscription)
        .expect(201);

      const subscriptionId = createResponse.body.eeSubscription.subscriptionId;

      await request(app)
        .delete(`/nudm-ee/v1/${ueIdentity}/ee-subscriptions/${subscriptionId}`)
        .expect(204);
    });

    it('should delete multiple subscriptions independently', async () => {
      const createResponse1 = await request(app)
        .post(`/nudm-ee/v1/${validUeIdentity}/ee-subscriptions`)
        .send(validSubscription)
        .expect(201);

      const createResponse2 = await request(app)
        .post(`/nudm-ee/v1/${validUeIdentity}/ee-subscriptions`)
        .send(validSubscription)
        .expect(201);

      const subscriptionId1 = createResponse1.body.eeSubscription.subscriptionId;
      const subscriptionId2 = createResponse2.body.eeSubscription.subscriptionId;

      await request(app)
        .delete(`/nudm-ee/v1/${validUeIdentity}/ee-subscriptions/${subscriptionId1}`)
        .expect(204);

      await request(app)
        .delete(`/nudm-ee/v1/${validUeIdentity}/ee-subscriptions/${subscriptionId2}`)
        .expect(204);
    });
  });

  describe('Error cases', () => {
    it('should return 404 when subscription does not exist', async () => {
      const nonExistentId = '00000000-0000-0000-0000-000000000000';

      const response = await request(app)
        .delete(`/nudm-ee/v1/${validUeIdentity}/ee-subscriptions/${nonExistentId}`)
        .expect(404)
        .expect('Content-Type', /json/);

      expect(response.body).to.have.property('title', 'Not Found');
      expect(response.body).to.have.property('status', 404);
      expect(response.body.detail).to.include('Subscription not found');
    });

    it('should return 404 when subscription was already deleted', async () => {
      const createResponse = await request(app)
        .post(`/nudm-ee/v1/${validUeIdentity}/ee-subscriptions`)
        .send(validSubscription)
        .expect(201);

      const subscriptionId = createResponse.body.eeSubscription.subscriptionId;

      await request(app)
        .delete(`/nudm-ee/v1/${validUeIdentity}/ee-subscriptions/${subscriptionId}`)
        .expect(204);

      const response = await request(app)
        .delete(`/nudm-ee/v1/${validUeIdentity}/ee-subscriptions/${subscriptionId}`)
        .expect(404);

      expect(response.body).to.have.property('title', 'Not Found');
      expect(response.body).to.have.property('status', 404);
    });

    it('should return 404 when ueIdentity does not match', async () => {
      const createResponse = await request(app)
        .post(`/nudm-ee/v1/${validUeIdentity}/ee-subscriptions`)
        .send(validSubscription)
        .expect(201);

      const subscriptionId = createResponse.body.eeSubscription.subscriptionId;

      const differentUeIdentity = 'imsi-999999999999999';
      const response = await request(app)
        .delete(`/nudm-ee/v1/${differentUeIdentity}/ee-subscriptions/${subscriptionId}`)
        .expect(404);

      expect(response.body).to.have.property('title', 'Not Found');
      expect(response.body).to.have.property('status', 404);
    });

    it('should return 400 for invalid msisdn format (too short)', async () => {
      const response = await request(app)
        .delete('/nudm-ee/v1/msisdn-1234/ee-subscriptions/some-id')
        .expect(400);

      expect(response.body).to.have.property('title', 'Bad Request');
      expect(response.body).to.have.property('status', 400);
      expect(response.body.detail).to.include('ueIdentity');
    });

    it('should return 400 for invalid msisdn format (too long)', async () => {
      const response = await request(app)
        .delete('/nudm-ee/v1/msisdn-1234567890123456/ee-subscriptions/some-id')
        .expect(400);

      expect(response.body).to.have.property('title', 'Bad Request');
      expect(response.body.detail).to.include('ueIdentity');
    });

    it('should return 400 for invalid msisdn format (non-numeric)', async () => {
      const response = await request(app)
        .delete('/nudm-ee/v1/msisdn-abcde/ee-subscriptions/some-id')
        .expect(400);

      expect(response.body).to.have.property('title', 'Bad Request');
      expect(response.body.detail).to.include('ueIdentity');
    });

    it('should return 400 for invalid imsi format (too short)', async () => {
      const response = await request(app)
        .delete('/nudm-ee/v1/imsi-1234/ee-subscriptions/some-id')
        .expect(400);

      expect(response.body).to.have.property('title', 'Bad Request');
      expect(response.body.detail).to.include('ueIdentity');
    });

    it('should return 400 for invalid extid format (missing @)', async () => {
      const response = await request(app)
        .delete('/nudm-ee/v1/extid-userexample.com/ee-subscriptions/some-id')
        .expect(400);

      expect(response.body).to.have.property('title', 'Bad Request');
      expect(response.body.detail).to.include('ueIdentity');
    });

    it('should return 400 for invalid ueIdentity format', async () => {
      const response = await request(app)
        .delete('/nudm-ee/v1/invalid-format/ee-subscriptions/some-id')
        .expect(400);

      expect(response.body).to.have.property('title', 'Bad Request');
      expect(response.body).to.have.property('status', 400);
      expect(response.body.detail).to.include('Invalid ueIdentity format');
    });
  });
});

describe('PATCH /:ueIdentity/ee-subscriptions/:subscriptionId', () => {
  const validUeIdentity = 'imsi-123456789012345';
  const validSubscription = {
    callbackReference: 'http://example.com/callback',
    monitoringConfigurations: {
      '1': {
        eventType: 'LOSS_OF_CONNECTIVITY'
      }
    }
  };

  describe('Success cases - replace operation', () => {
    it('should replace callbackReference successfully', async () => {
      const createResponse = await request(app)
        .post(`/nudm-ee/v1/${validUeIdentity}/ee-subscriptions`)
        .send(validSubscription)
        .expect(201);

      const subscriptionId = createResponse.body.eeSubscription.subscriptionId;

      const patchOperations = [
        {
          op: 'replace',
          path: '/callbackReference',
          value: 'http://new-callback.com/endpoint'
        }
      ];

      await request(app)
        .patch(`/nudm-ee/v1/${validUeIdentity}/ee-subscriptions/${subscriptionId}`)
        .set('Content-Type', 'application/json-patch+json')
        .send(patchOperations)
        .expect(204);
    });

    it('should replace monitoring configuration', async () => {
      const createResponse = await request(app)
        .post(`/nudm-ee/v1/${validUeIdentity}/ee-subscriptions`)
        .send(validSubscription)
        .expect(201);

      const subscriptionId = createResponse.body.eeSubscription.subscriptionId;

      const patchOperations = [
        {
          op: 'replace',
          path: '/monitoringConfigurations/1/eventType',
          value: 'UE_REACHABILITY_FOR_DATA'
        }
      ];

      await request(app)
        .patch(`/nudm-ee/v1/${validUeIdentity}/ee-subscriptions/${subscriptionId}`)
        .set('Content-Type', 'application/json-patch+json')
        .send(patchOperations)
        .expect(204);
    });

    it('should handle multiple replace operations', async () => {
      const createResponse = await request(app)
        .post(`/nudm-ee/v1/${validUeIdentity}/ee-subscriptions`)
        .send(validSubscription)
        .expect(201);

      const subscriptionId = createResponse.body.eeSubscription.subscriptionId;

      const patchOperations = [
        {
          op: 'replace',
          path: '/callbackReference',
          value: 'http://new-callback.com/endpoint'
        },
        {
          op: 'replace',
          path: '/monitoringConfigurations/1/eventType',
          value: 'ROAMING_STATUS'
        }
      ];

      await request(app)
        .patch(`/nudm-ee/v1/${validUeIdentity}/ee-subscriptions/${subscriptionId}`)
        .set('Content-Type', 'application/json-patch+json')
        .send(patchOperations)
        .expect(204);
    });
  });

  describe('Success cases - add operation', () => {
    it('should add a new monitoring configuration', async () => {
      const createResponse = await request(app)
        .post(`/nudm-ee/v1/${validUeIdentity}/ee-subscriptions`)
        .send(validSubscription)
        .expect(201);

      const subscriptionId = createResponse.body.eeSubscription.subscriptionId;

      const patchOperations = [
        {
          op: 'add',
          path: '/monitoringConfigurations/2',
          value: {
            eventType: 'LOCATION_REPORTING',
            locationReportingConfiguration: {
              currentLocation: true
            }
          }
        }
      ];

      await request(app)
        .patch(`/nudm-ee/v1/${validUeIdentity}/ee-subscriptions/${subscriptionId}`)
        .set('Content-Type', 'application/json-patch+json')
        .send(patchOperations)
        .expect(204);
    });

    it('should add reportingOptions', async () => {
      const createResponse = await request(app)
        .post(`/nudm-ee/v1/${validUeIdentity}/ee-subscriptions`)
        .send(validSubscription)
        .expect(201);

      const subscriptionId = createResponse.body.eeSubscription.subscriptionId;

      const patchOperations = [
        {
          op: 'add',
          path: '/reportingOptions',
          value: {
            reportMode: 'PERIODIC',
            reportPeriod: 3600
          }
        }
      ];

      await request(app)
        .patch(`/nudm-ee/v1/${validUeIdentity}/ee-subscriptions/${subscriptionId}`)
        .set('Content-Type', 'application/json-patch+json')
        .send(patchOperations)
        .expect(204);
    });

    it('should add supportedFeatures', async () => {
      const createResponse = await request(app)
        .post(`/nudm-ee/v1/${validUeIdentity}/ee-subscriptions`)
        .send(validSubscription)
        .expect(201);

      const subscriptionId = createResponse.body.eeSubscription.subscriptionId;

      const patchOperations = [
        {
          op: 'add',
          path: '/supportedFeatures',
          value: 'ABC123'
        }
      ];

      await request(app)
        .patch(`/nudm-ee/v1/${validUeIdentity}/ee-subscriptions/${subscriptionId}`)
        .set('Content-Type', 'application/json-patch+json')
        .send(patchOperations)
        .expect(204);
    });
  });

  describe('Success cases - remove operation', () => {
    it('should remove an optional field', async () => {
      const subscriptionWithOptional = {
        ...validSubscription,
        supportedFeatures: 'ABC123'
      };

      const createResponse = await request(app)
        .post(`/nudm-ee/v1/${validUeIdentity}/ee-subscriptions`)
        .send(subscriptionWithOptional)
        .expect(201);

      const subscriptionId = createResponse.body.eeSubscription.subscriptionId;

      const patchOperations = [
        {
          op: 'remove',
          path: '/supportedFeatures'
        }
      ];

      await request(app)
        .patch(`/nudm-ee/v1/${validUeIdentity}/ee-subscriptions/${subscriptionId}`)
        .set('Content-Type', 'application/json-patch+json')
        .send(patchOperations)
        .expect(204);
    });

    it('should remove a monitoring configuration', async () => {
      const multiConfigSubscription = {
        callbackReference: 'http://example.com/callback',
        monitoringConfigurations: {
          '1': {
            eventType: 'LOSS_OF_CONNECTIVITY'
          },
          '2': {
            eventType: 'ROAMING_STATUS'
          }
        }
      };

      const createResponse = await request(app)
        .post(`/nudm-ee/v1/${validUeIdentity}/ee-subscriptions`)
        .send(multiConfigSubscription)
        .expect(201);

      const subscriptionId = createResponse.body.eeSubscription.subscriptionId;

      const patchOperations = [
        {
          op: 'remove',
          path: '/monitoringConfigurations/2'
        }
      ];

      await request(app)
        .patch(`/nudm-ee/v1/${validUeIdentity}/ee-subscriptions/${subscriptionId}`)
        .set('Content-Type', 'application/json-patch+json')
        .send(patchOperations)
        .expect(204);
    });
  });

  describe('Success cases - move operation', () => {
    it('should move a monitoring configuration', async () => {
      const createResponse = await request(app)
        .post(`/nudm-ee/v1/${validUeIdentity}/ee-subscriptions`)
        .send(validSubscription)
        .expect(201);

      const subscriptionId = createResponse.body.eeSubscription.subscriptionId;

      const patchOperations = [
        {
          op: 'move',
          from: '/monitoringConfigurations/1',
          path: '/monitoringConfigurations/2'
        }
      ];

      await request(app)
        .patch(`/nudm-ee/v1/${validUeIdentity}/ee-subscriptions/${subscriptionId}`)
        .set('Content-Type', 'application/json-patch+json')
        .send(patchOperations)
        .expect(204);
    });
  });

  describe('Success cases - copy operation', () => {
    it('should copy a monitoring configuration', async () => {
      const createResponse = await request(app)
        .post(`/nudm-ee/v1/${validUeIdentity}/ee-subscriptions`)
        .send(validSubscription)
        .expect(201);

      const subscriptionId = createResponse.body.eeSubscription.subscriptionId;

      const patchOperations = [
        {
          op: 'copy',
          from: '/monitoringConfigurations/1',
          path: '/monitoringConfigurations/2'
        }
      ];

      await request(app)
        .patch(`/nudm-ee/v1/${validUeIdentity}/ee-subscriptions/${subscriptionId}`)
        .set('Content-Type', 'application/json-patch+json')
        .send(patchOperations)
        .expect(204);
    });
  });

  describe('Success cases - test operation', () => {
    it('should pass test operation when value matches', async () => {
      const createResponse = await request(app)
        .post(`/nudm-ee/v1/${validUeIdentity}/ee-subscriptions`)
        .send(validSubscription)
        .expect(201);

      const subscriptionId = createResponse.body.eeSubscription.subscriptionId;

      const patchOperations = [
        {
          op: 'test',
          path: '/callbackReference',
          value: 'http://example.com/callback'
        }
      ];

      await request(app)
        .patch(`/nudm-ee/v1/${validUeIdentity}/ee-subscriptions/${subscriptionId}`)
        .set('Content-Type', 'application/json-patch+json')
        .send(patchOperations)
        .expect(204);
    });
  });

  describe('Success cases - different ueIdentity formats', () => {
    it('should patch subscription with msisdn format ueIdentity', async () => {
      const ueIdentity = 'msisdn-1234567890';
      const createResponse = await request(app)
        .post(`/nudm-ee/v1/${ueIdentity}/ee-subscriptions`)
        .send(validSubscription)
        .expect(201);

      const subscriptionId = createResponse.body.eeSubscription.subscriptionId;

      const patchOperations = [
        {
          op: 'replace',
          path: '/callbackReference',
          value: 'http://new-callback.com/endpoint'
        }
      ];

      await request(app)
        .patch(`/nudm-ee/v1/${ueIdentity}/ee-subscriptions/${subscriptionId}`)
        .set('Content-Type', 'application/json-patch+json')
        .send(patchOperations)
        .expect(204);
    });

    it('should patch subscription with extid format ueIdentity', async () => {
      const ueIdentity = 'extid-user@example.com';
      const createResponse = await request(app)
        .post(`/nudm-ee/v1/${ueIdentity}/ee-subscriptions`)
        .send(validSubscription)
        .expect(201);

      const subscriptionId = createResponse.body.eeSubscription.subscriptionId;

      const patchOperations = [
        {
          op: 'replace',
          path: '/callbackReference',
          value: 'http://new-callback.com/endpoint'
        }
      ];

      await request(app)
        .patch(`/nudm-ee/v1/${ueIdentity}/ee-subscriptions/${subscriptionId}`)
        .set('Content-Type', 'application/json-patch+json')
        .send(patchOperations)
        .expect(204);
    });

    it('should patch subscription with anyUE as ueIdentity', async () => {
      const ueIdentity = 'anyUE';
      const createResponse = await request(app)
        .post(`/nudm-ee/v1/${ueIdentity}/ee-subscriptions`)
        .send(validSubscription)
        .expect(201);

      const subscriptionId = createResponse.body.eeSubscription.subscriptionId;

      const patchOperations = [
        {
          op: 'replace',
          path: '/callbackReference',
          value: 'http://new-callback.com/endpoint'
        }
      ];

      await request(app)
        .patch(`/nudm-ee/v1/${ueIdentity}/ee-subscriptions/${subscriptionId}`)
        .set('Content-Type', 'application/json-patch+json')
        .send(patchOperations)
        .expect(204);
    });
  });

  describe('Success cases - complex operations', () => {
    it('should handle mixed operations in one request', async () => {
      const createResponse = await request(app)
        .post(`/nudm-ee/v1/${validUeIdentity}/ee-subscriptions`)
        .send(validSubscription)
        .expect(201);

      const subscriptionId = createResponse.body.eeSubscription.subscriptionId;

      const patchOperations = [
        {
          op: 'replace',
          path: '/callbackReference',
          value: 'http://new-callback.com/endpoint'
        },
        {
          op: 'add',
          path: '/supportedFeatures',
          value: 'XYZ789'
        },
        {
          op: 'add',
          path: '/monitoringConfigurations/2',
          value: {
            eventType: 'ROAMING_STATUS'
          }
        }
      ];

      await request(app)
        .patch(`/nudm-ee/v1/${validUeIdentity}/ee-subscriptions/${subscriptionId}`)
        .set('Content-Type', 'application/json-patch+json')
        .send(patchOperations)
        .expect(204);
    });
  });

  describe('Error cases - not found', () => {
    it('should return 404 when subscription does not exist', async () => {
      const nonExistentId = '00000000-0000-0000-0000-000000000000';

      const patchOperations = [
        {
          op: 'replace',
          path: '/callbackReference',
          value: 'http://new-callback.com/endpoint'
        }
      ];

      const response = await request(app)
        .patch(`/nudm-ee/v1/${validUeIdentity}/ee-subscriptions/${nonExistentId}`)
        .set('Content-Type', 'application/json-patch+json')
        .send(patchOperations)
        .expect(404)
        .expect('Content-Type', /json/);

      expect(response.body).to.have.property('title', 'Not Found');
      expect(response.body).to.have.property('status', 404);
      expect(response.body.detail).to.include('Subscription not found');
    });

    it('should return 404 when ueIdentity does not match', async () => {
      const createResponse = await request(app)
        .post(`/nudm-ee/v1/${validUeIdentity}/ee-subscriptions`)
        .send(validSubscription)
        .expect(201);

      const subscriptionId = createResponse.body.eeSubscription.subscriptionId;

      const patchOperations = [
        {
          op: 'replace',
          path: '/callbackReference',
          value: 'http://new-callback.com/endpoint'
        }
      ];

      const differentUeIdentity = 'imsi-999999999999999';
      const response = await request(app)
        .patch(`/nudm-ee/v1/${differentUeIdentity}/ee-subscriptions/${subscriptionId}`)
        .set('Content-Type', 'application/json-patch+json')
        .send(patchOperations)
        .expect(404);

      expect(response.body).to.have.property('title', 'Not Found');
      expect(response.body).to.have.property('status', 404);
    });
  });

  describe('Error cases - invalid ueIdentity', () => {
    it('should return 400 for invalid msisdn format (too short)', async () => {
      const patchOperations = [
        {
          op: 'replace',
          path: '/callbackReference',
          value: 'http://new-callback.com/endpoint'
        }
      ];

      const response = await request(app)
        .patch('/nudm-ee/v1/msisdn-1234/ee-subscriptions/some-id')
        .set('Content-Type', 'application/json-patch+json')
        .send(patchOperations)
        .expect(400);

      expect(response.body).to.have.property('title', 'Bad Request');
      expect(response.body.detail).to.include('ueIdentity');
    });

    it('should return 400 for invalid msisdn format (too long)', async () => {
      const patchOperations = [
        {
          op: 'replace',
          path: '/callbackReference',
          value: 'http://new-callback.com/endpoint'
        }
      ];

      const response = await request(app)
        .patch('/nudm-ee/v1/msisdn-1234567890123456/ee-subscriptions/some-id')
        .set('Content-Type', 'application/json-patch+json')
        .send(patchOperations)
        .expect(400);

      expect(response.body).to.have.property('title', 'Bad Request');
      expect(response.body.detail).to.include('ueIdentity');
    });

    it('should return 400 for invalid imsi format', async () => {
      const patchOperations = [
        {
          op: 'replace',
          path: '/callbackReference',
          value: 'http://new-callback.com/endpoint'
        }
      ];

      const response = await request(app)
        .patch('/nudm-ee/v1/imsi-1234/ee-subscriptions/some-id')
        .set('Content-Type', 'application/json-patch+json')
        .send(patchOperations)
        .expect(400);

      expect(response.body).to.have.property('title', 'Bad Request');
      expect(response.body.detail).to.include('ueIdentity');
    });

    it('should return 400 for invalid extid format', async () => {
      const patchOperations = [
        {
          op: 'replace',
          path: '/callbackReference',
          value: 'http://new-callback.com/endpoint'
        }
      ];

      const response = await request(app)
        .patch('/nudm-ee/v1/extid-userexample.com/ee-subscriptions/some-id')
        .set('Content-Type', 'application/json-patch+json')
        .send(patchOperations)
        .expect(400);

      expect(response.body).to.have.property('title', 'Bad Request');
      expect(response.body.detail).to.include('ueIdentity');
    });

    it('should return 400 for completely invalid ueIdentity format', async () => {
      const patchOperations = [
        {
          op: 'replace',
          path: '/callbackReference',
          value: 'http://new-callback.com/endpoint'
        }
      ];

      const response = await request(app)
        .patch('/nudm-ee/v1/invalid-format/ee-subscriptions/some-id')
        .set('Content-Type', 'application/json-patch+json')
        .send(patchOperations)
        .expect(400);

      expect(response.body).to.have.property('title', 'Bad Request');
      expect(response.body).to.have.property('status', 400);
      expect(response.body.detail).to.include('Invalid ueIdentity format');
    });
  });

  describe('Error cases - invalid request body', () => {
    it('should return 400 when patch operations array is empty', async () => {
      const createResponse = await request(app)
        .post(`/nudm-ee/v1/${validUeIdentity}/ee-subscriptions`)
        .send(validSubscription)
        .expect(201);

      const subscriptionId = createResponse.body.eeSubscription.subscriptionId;

      const response = await request(app)
        .patch(`/nudm-ee/v1/${validUeIdentity}/ee-subscriptions/${subscriptionId}`)
        .set('Content-Type', 'application/json-patch+json')
        .send([])
        .expect(400);

      expect(response.body).to.have.property('title', 'Bad Request');
      expect(response.body).to.have.property('status', 400);
      expect(response.body.detail).to.include('non-empty array');
    });

    it('should return 400 when request body is not an array', async () => {
      const createResponse = await request(app)
        .post(`/nudm-ee/v1/${validUeIdentity}/ee-subscriptions`)
        .send(validSubscription)
        .expect(201);

      const subscriptionId = createResponse.body.eeSubscription.subscriptionId;

      const response = await request(app)
        .patch(`/nudm-ee/v1/${validUeIdentity}/ee-subscriptions/${subscriptionId}`)
        .set('Content-Type', 'application/json-patch+json')
        .send({ op: 'replace', path: '/callbackReference', value: 'test' })
        .expect(400);

      expect(response.body).to.have.property('title', 'Bad Request');
      expect(response.body).to.have.property('status', 400);
    });
  });

  describe('Partial failure cases', () => {
    it('should return 200 with report when operation has missing fields', async () => {
      const createResponse = await request(app)
        .post(`/nudm-ee/v1/${validUeIdentity}/ee-subscriptions`)
        .send(validSubscription)
        .expect(201);

      const subscriptionId = createResponse.body.eeSubscription.subscriptionId;

      const patchOperations = [
        {
          op: 'replace',
          value: 'http://new-callback.com/endpoint'
        }
      ];

      const response = await request(app)
        .patch(`/nudm-ee/v1/${validUeIdentity}/ee-subscriptions/${subscriptionId}`)
        .set('Content-Type', 'application/json-patch+json')
        .send(patchOperations)
        .expect(200);

      expect(response.body).to.have.property('report');
      expect(response.body.report).to.be.an('array').with.lengthOf(1);
      expect(response.body.report[0]).to.have.property('originalError');
      expect(response.body.report[0].originalError.detail).to.include('Missing required fields');
    });

    it('should return 200 with report when path does not exist for replace', async () => {
      const createResponse = await request(app)
        .post(`/nudm-ee/v1/${validUeIdentity}/ee-subscriptions`)
        .send(validSubscription)
        .expect(201);

      const subscriptionId = createResponse.body.eeSubscription.subscriptionId;

      const patchOperations = [
        {
          op: 'replace',
          path: '/nonExistentField',
          value: 'someValue'
        }
      ];

      const response = await request(app)
        .patch(`/nudm-ee/v1/${validUeIdentity}/ee-subscriptions/${subscriptionId}`)
        .set('Content-Type', 'application/json-patch+json')
        .send(patchOperations)
        .expect(200);

      expect(response.body).to.have.property('report');
      expect(response.body.report).to.be.an('array').with.lengthOf(1);
      expect(response.body.report[0]).to.have.property('op', 'replace');
      expect(response.body.report[0]).to.have.property('path', '/nonExistentField');
      expect(response.body.report[0].originalError.detail).to.include('Path not found');
    });

    it('should return 200 with report when test operation fails', async () => {
      const createResponse = await request(app)
        .post(`/nudm-ee/v1/${validUeIdentity}/ee-subscriptions`)
        .send(validSubscription)
        .expect(201);

      const subscriptionId = createResponse.body.eeSubscription.subscriptionId;

      const patchOperations = [
        {
          op: 'test',
          path: '/callbackReference',
          value: 'http://wrong-value.com/callback'
        }
      ];

      const response = await request(app)
        .patch(`/nudm-ee/v1/${validUeIdentity}/ee-subscriptions/${subscriptionId}`)
        .set('Content-Type', 'application/json-patch+json')
        .send(patchOperations)
        .expect(200);

      expect(response.body).to.have.property('report');
      expect(response.body.report).to.be.an('array').with.lengthOf(1);
      expect(response.body.report[0].originalError.detail).to.include('Test operation failed');
    });

    it('should return 200 with report when move operation is missing from field', async () => {
      const createResponse = await request(app)
        .post(`/nudm-ee/v1/${validUeIdentity}/ee-subscriptions`)
        .send(validSubscription)
        .expect(201);

      const subscriptionId = createResponse.body.eeSubscription.subscriptionId;

      const patchOperations = [
        {
          op: 'move',
          path: '/newField'
        }
      ];

      const response = await request(app)
        .patch(`/nudm-ee/v1/${validUeIdentity}/ee-subscriptions/${subscriptionId}`)
        .set('Content-Type', 'application/json-patch+json')
        .send(patchOperations)
        .expect(200);

      expect(response.body).to.have.property('report');
      expect(response.body.report).to.be.an('array').with.lengthOf(1);
      expect(response.body.report[0].originalError.detail).to.include('from');
    });

    it('should return 200 with report when copy operation is missing from field', async () => {
      const createResponse = await request(app)
        .post(`/nudm-ee/v1/${validUeIdentity}/ee-subscriptions`)
        .send(validSubscription)
        .expect(201);

      const subscriptionId = createResponse.body.eeSubscription.subscriptionId;

      const patchOperations = [
        {
          op: 'copy',
          path: '/newField'
        }
      ];

      const response = await request(app)
        .patch(`/nudm-ee/v1/${validUeIdentity}/ee-subscriptions/${subscriptionId}`)
        .set('Content-Type', 'application/json-patch+json')
        .send(patchOperations)
        .expect(200);

      expect(response.body).to.have.property('report');
      expect(response.body.report).to.be.an('array').with.lengthOf(1);
      expect(response.body.report[0].originalError.detail).to.include('from');
    });

    it('should return 200 with report when unsupported operation is used', async () => {
      const createResponse = await request(app)
        .post(`/nudm-ee/v1/${validUeIdentity}/ee-subscriptions`)
        .send(validSubscription)
        .expect(201);

      const subscriptionId = createResponse.body.eeSubscription.subscriptionId;

      const patchOperations = [
        {
          op: 'invalid-op',
          path: '/callbackReference',
          value: 'test'
        }
      ];

      const response = await request(app)
        .patch(`/nudm-ee/v1/${validUeIdentity}/ee-subscriptions/${subscriptionId}`)
        .set('Content-Type', 'application/json-patch+json')
        .send(patchOperations)
        .expect(200);

      expect(response.body).to.have.property('report');
      expect(response.body.report).to.be.an('array').with.lengthOf(1);
      expect(response.body.report[0].originalError.detail).to.include('Unsupported operation');
    });

    it('should apply successful operations and report failed ones', async () => {
      const createResponse = await request(app)
        .post(`/nudm-ee/v1/${validUeIdentity}/ee-subscriptions`)
        .send(validSubscription)
        .expect(201);

      const subscriptionId = createResponse.body.eeSubscription.subscriptionId;

      const patchOperations = [
        {
          op: 'replace',
          path: '/callbackReference',
          value: 'http://new-callback.com/endpoint'
        },
        {
          op: 'replace',
          path: '/nonExistentField',
          value: 'someValue'
        },
        {
          op: 'add',
          path: '/supportedFeatures',
          value: 'ABC123'
        }
      ];

      const response = await request(app)
        .patch(`/nudm-ee/v1/${validUeIdentity}/ee-subscriptions/${subscriptionId}`)
        .set('Content-Type', 'application/json-patch+json')
        .send(patchOperations)
        .expect(200);

      expect(response.body).to.have.property('report');
      expect(response.body.report).to.be.an('array').with.lengthOf(1);
      expect(response.body.report[0]).to.have.property('path', '/nonExistentField');
    });
  });

  describe('Error cases - remove non-existent path', () => {
    it('should return 200 with report when trying to remove non-existent field', async () => {
      const createResponse = await request(app)
        .post(`/nudm-ee/v1/${validUeIdentity}/ee-subscriptions`)
        .send(validSubscription)
        .expect(201);

      const subscriptionId = createResponse.body.eeSubscription.subscriptionId;

      const patchOperations = [
        {
          op: 'remove',
          path: '/nonExistentField'
        }
      ];

      const response = await request(app)
        .patch(`/nudm-ee/v1/${validUeIdentity}/ee-subscriptions/${subscriptionId}`)
        .set('Content-Type', 'application/json-patch+json')
        .send(patchOperations)
        .expect(200);

      expect(response.body).to.have.property('report');
      expect(response.body.report).to.be.an('array').with.lengthOf(1);
      expect(response.body.report[0].originalError.detail).to.include('Path not found');
    });
  });
});

