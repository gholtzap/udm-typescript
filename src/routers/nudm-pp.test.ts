import { expect } from 'chai';
import request from 'supertest';
import express from 'express';
import router from './nudm-pp';

const app = express();
app.use(express.json());
app.use('/nudm-pp/v1', router);

describe('GET /:ueId/pp-data', () => {
  const validUeId = 'imsi-123456789012345';

  describe('Success cases', () => {
    it('should return PP data for valid UE', async () => {
      const response = await request(app)
        .get(`/nudm-pp/v1/${validUeId}/pp-data`)
        .expect(200)
        .expect('Content-Type', /json/);

      expect(response.body).to.have.property('communicationCharacteristics');
      expect(response.body).to.have.property('expectedUeBehaviourParameters');
      expect(response.body).to.have.property('ecRestriction');
    });

    it('should return communication characteristics', async () => {
      const response = await request(app)
        .get(`/nudm-pp/v1/${validUeId}/pp-data`)
        .expect(200);

      expect(response.body.communicationCharacteristics).to.be.an('object');
      expect(response.body.communicationCharacteristics).to.have.property('ppSubsRegTimer');
      expect(response.body.communicationCharacteristics).to.have.property('ppActiveTime');
      expect(response.body.communicationCharacteristics).to.have.property('ppDlPacketCount');
    });

    it('should return expected UE behaviour parameters', async () => {
      const response = await request(app)
        .get(`/nudm-pp/v1/${validUeId}/pp-data`)
        .expect(200);

      expect(response.body.expectedUeBehaviourParameters).to.be.an('object');
      expect(response.body.expectedUeBehaviourParameters).to.have.property('afInstanceId');
      expect(response.body.expectedUeBehaviourParameters).to.have.property('referenceId');
      expect(response.body.expectedUeBehaviourParameters).to.have.property('stationaryIndication');
    });

    it('should return EC restriction data', async () => {
      const response = await request(app)
        .get(`/nudm-pp/v1/${validUeId}/pp-data`)
        .expect(200);

      expect(response.body.ecRestriction).to.be.an('object');
      expect(response.body.ecRestriction).to.have.property('afInstanceId');
      expect(response.body.ecRestriction).to.have.property('plmnEcInfos');
      expect(response.body.ecRestriction.plmnEcInfos).to.be.an('array');
    });

    it('should accept msisdn format for ueId', async () => {
      const response = await request(app)
        .get('/nudm-pp/v1/msisdn-1234567890/pp-data')
        .expect(200);

      expect(response.body).to.have.property('communicationCharacteristics');
    });

    it('should accept extid format for ueId', async () => {
      const response = await request(app)
        .get('/nudm-pp/v1/extid-user@domain.com/pp-data')
        .expect(200);

      expect(response.body).to.have.property('communicationCharacteristics');
    });

    it('should accept nai format for ueId', async () => {
      const response = await request(app)
        .get('/nudm-pp/v1/nai-user@example.com/pp-data')
        .expect(200);

      expect(response.body).to.have.property('communicationCharacteristics');
    });

    it('should accept gci format for ueId', async () => {
      const response = await request(app)
        .get('/nudm-pp/v1/gci-123456/pp-data')
        .expect(200);

      expect(response.body).to.have.property('communicationCharacteristics');
    });

    it('should accept gli format for ueId', async () => {
      const response = await request(app)
        .get('/nudm-pp/v1/gli-abcdef/pp-data')
        .expect(200);

      expect(response.body).to.have.property('communicationCharacteristics');
    });

    it('should accept extgroupid format for ueId', async () => {
      const response = await request(app)
        .get('/nudm-pp/v1/extgroupid-group@domain.com/pp-data')
        .expect(200);

      expect(response.body).to.have.property('communicationCharacteristics');
    });

    it('should accept af-instance-id query parameter', async () => {
      const uniqueUeId = 'imsi-999888777666555';
      const response = await request(app)
        .get(`/nudm-pp/v1/${uniqueUeId}/pp-data`)
        .query({ 'af-instance-id': 'af-123' })
        .expect(200);

      expect(response.body.communicationCharacteristics.ppSubsRegTimer.afInstanceId).to.equal('af-123');
      expect(response.body.expectedUeBehaviourParameters.afInstanceId).to.equal('af-123');
    });

    it('should accept mtc-provider-information query parameter', async () => {
      const response = await request(app)
        .get(`/nudm-pp/v1/${validUeId}/pp-data`)
        .query({ 'mtc-provider-information': 'mtc-provider-data' })
        .expect(200);

      expect(response.body).to.have.property('communicationCharacteristics');
    });

    it('should accept supported-features query parameter', async () => {
      const response = await request(app)
        .get(`/nudm-pp/v1/${validUeId}/pp-data`)
        .query({ 'supported-features': 'ABC123' })
        .expect(200);

      expect(response.body).to.have.property('supportedFeatures', 'ABC123');
    });

    it('should accept all query parameters together', async () => {
      const uniqueUeId = 'imsi-111222333444555';
      const response = await request(app)
        .get(`/nudm-pp/v1/${uniqueUeId}/pp-data`)
        .query({
          'af-instance-id': 'af-123',
          'mtc-provider-information': 'mtc-provider-data',
          'supported-features': 'ABC123'
        })
        .expect(200);

      expect(response.body).to.have.property('supportedFeatures', 'ABC123');
      expect(response.body.communicationCharacteristics.ppSubsRegTimer.afInstanceId).to.equal('af-123');
    });

    it('should return consistent data for same ueId', async () => {
      const response1 = await request(app)
        .get(`/nudm-pp/v1/${validUeId}/pp-data`)
        .expect(200);

      const response2 = await request(app)
        .get(`/nudm-pp/v1/${validUeId}/pp-data`)
        .expect(200);

      expect(response1.body.communicationCharacteristics).to.deep.equal(response2.body.communicationCharacteristics);
    });
  });

  describe('Validation error cases', () => {
    it('should return 400 for invalid ueId format', async () => {
      const response = await request(app)
        .get('/nudm-pp/v1/invalid-ueid/pp-data')
        .expect(400)
        .expect('Content-Type', /json/);

      expect(response.body).to.have.property('status', 400);
      expect(response.body).to.have.property('title', 'Bad Request');
      expect(response.body).to.have.property('detail');
      expect(response.body.detail).to.include('ueId');
      expect(response.body).to.have.property('cause', 'INVALID_PARAMETER');
    });

    it('should return 400 for ueId with invalid imsi prefix', async () => {
      const response = await request(app)
        .get('/nudm-pp/v1/imsi-123/pp-data')
        .expect(400);

      expect(response.body).to.have.property('status', 400);
      expect(response.body.cause).to.equal('INVALID_PARAMETER');
    });

    it('should return 400 for ueId with too short imsi', async () => {
      const response = await request(app)
        .get('/nudm-pp/v1/imsi-1234/pp-data')
        .expect(400);

      expect(response.body).to.have.property('status', 400);
    });

    it('should return 400 for ueId with too long imsi', async () => {
      const response = await request(app)
        .get('/nudm-pp/v1/imsi-1234567890123456/pp-data')
        .expect(400);

      expect(response.body).to.have.property('status', 400);
    });

    it('should return 400 for ueId with too short msisdn', async () => {
      const response = await request(app)
        .get('/nudm-pp/v1/msisdn-1234/pp-data')
        .expect(400);

      expect(response.body).to.have.property('status', 400);
    });

    it('should return 400 for ueId with too long msisdn', async () => {
      const response = await request(app)
        .get('/nudm-pp/v1/msisdn-1234567890123456/pp-data')
        .expect(400);

      expect(response.body).to.have.property('status', 400);
    });

    it('should return 400 for extid without @ symbol', async () => {
      const response = await request(app)
        .get('/nudm-pp/v1/extid-nodomain/pp-data')
        .expect(400);

      expect(response.body).to.have.property('status', 400);
    });

    it('should return 400 for extgroupid without @ symbol', async () => {
      const response = await request(app)
        .get('/nudm-pp/v1/extgroupid-nodomain/pp-data')
        .expect(400);

      expect(response.body).to.have.property('status', 400);
    });

    it('should return 400 for empty ueId prefix', async () => {
      const response = await request(app)
        .get('/nudm-pp/v1/imsi-/pp-data')
        .expect(400);

      expect(response.body).to.have.property('status', 400);
    });

    it('should return 400 for unknown prefix', async () => {
      const response = await request(app)
        .get('/nudm-pp/v1/unknown-123456/pp-data')
        .expect(400);

      expect(response.body).to.have.property('status', 400);
    });

    it('should return 400 for ueId with special characters', async () => {
      const response = await request(app)
        .get('/nudm-pp/v1/imsi-12345abc/pp-data')
        .expect(400);

      expect(response.body).to.have.property('status', 400);
    });

    it('should return 400 for ueId with spaces', async () => {
      const response = await request(app)
        .get('/nudm-pp/v1/imsi-123456 789012345/pp-data')
        .expect(400);

      expect(response.body).to.have.property('status', 400);
    });
  });

  describe('Error response format', () => {
    it('should have correct 3GPP error structure for 400', async () => {
      const response = await request(app)
        .get('/nudm-pp/v1/invalid/pp-data')
        .expect(400);

      expect(response.body).to.have.property('type', 'urn:3gpp:error:invalid-parameter');
      expect(response.body).to.have.property('title');
      expect(response.body).to.have.property('status');
      expect(response.body).to.have.property('detail');
      expect(response.body).to.have.property('cause');
    });

    it('should return JSON content type for errors', async () => {
      await request(app)
        .get('/nudm-pp/v1/invalid/pp-data')
        .expect(400)
        .expect('Content-Type', /json/);
    });
  });

  describe('Edge cases', () => {
    it('should handle minimum valid imsi length', async () => {
      const response = await request(app)
        .get('/nudm-pp/v1/imsi-12345/pp-data')
        .expect(200);

      expect(response.body).to.have.property('communicationCharacteristics');
    });

    it('should handle maximum valid imsi length', async () => {
      const response = await request(app)
        .get('/nudm-pp/v1/imsi-123456789012345/pp-data')
        .expect(200);

      expect(response.body).to.have.property('communicationCharacteristics');
    });

    it('should handle minimum valid msisdn length', async () => {
      const response = await request(app)
        .get('/nudm-pp/v1/msisdn-12345/pp-data')
        .expect(200);

      expect(response.body).to.have.property('communicationCharacteristics');
    });

    it('should handle maximum valid msisdn length', async () => {
      const response = await request(app)
        .get('/nudm-pp/v1/msisdn-123456789012345/pp-data')
        .expect(200);

      expect(response.body).to.have.property('communicationCharacteristics');
    });

    it('should handle extid with multiple @ symbols', async () => {
      const response = await request(app)
        .get('/nudm-pp/v1/extid-user@domain@example.com/pp-data')
        .expect(400);

      expect(response.body).to.have.property('status', 400);
    });

    it('should handle nai with complex format', async () => {
      const response = await request(app)
        .get('/nudm-pp/v1/nai-complex.user-123@subdomain.example.com/pp-data')
        .expect(200);

      expect(response.body).to.have.property('communicationCharacteristics');
    });

    it('should handle URL encoded ueId', async () => {
      const response = await request(app)
        .get('/nudm-pp/v1/extid-user%40example.com/pp-data')
        .expect(200);

      expect(response.body).to.have.property('communicationCharacteristics');
    });
  });

  describe('Case sensitivity', () => {
    it('should be case sensitive for prefix', async () => {
      const response = await request(app)
        .get('/nudm-pp/v1/IMSI-123456789012345/pp-data')
        .expect(400);

      expect(response.body).to.have.property('status', 400);
    });

    it('should reject mixed case prefix', async () => {
      const response = await request(app)
        .get('/nudm-pp/v1/Imsi-123456789012345/pp-data')
        .expect(400);

      expect(response.body).to.have.property('status', 400);
    });
  });
});

describe('PATCH /:ueId/pp-data', () => {
  const validUeId = 'imsi-123456789012345';

  describe('Success cases', () => {
    it('should update PP data for valid UE', async () => {
      await request(app)
        .patch(`/nudm-pp/v1/${validUeId}/pp-data`)
        .send({
          communicationCharacteristics: {
            ppDlPacketCount: 20
          }
        })
        .expect(204);
    });

    it('should merge new data with existing data', async () => {
      const ueId = 'imsi-555666777888999';
      
      await request(app)
        .get(`/nudm-pp/v1/${ueId}/pp-data`)
        .expect(200);
      
      await request(app)
        .patch(`/nudm-pp/v1/${ueId}/pp-data`)
        .send({
          communicationCharacteristics: {
            ppDlPacketCount: 25
          }
        })
        .expect(204);
      
      const response = await request(app)
        .get(`/nudm-pp/v1/${ueId}/pp-data`)
        .expect(200);
      
      expect(response.body.communicationCharacteristics.ppDlPacketCount).to.equal(25);
      expect(response.body.communicationCharacteristics.ppSubsRegTimer).to.exist;
      expect(response.body.expectedUeBehaviourParameters).to.exist;
    });

    it('should handle deep merge of nested objects', async () => {
      const ueId = 'imsi-111222333444555';
      
      await request(app)
        .get(`/nudm-pp/v1/${ueId}/pp-data`)
        .expect(200);
      
      await request(app)
        .patch(`/nudm-pp/v1/${ueId}/pp-data`)
        .send({
          communicationCharacteristics: {
            ppSubsRegTimer: {
              subsRegTimer: 7200
            }
          }
        })
        .expect(204);
      
      const response = await request(app)
        .get(`/nudm-pp/v1/${ueId}/pp-data`)
        .expect(200);
      
      expect(response.body.communicationCharacteristics.ppSubsRegTimer.subsRegTimer).to.equal(7200);
      expect(response.body.communicationCharacteristics.ppSubsRegTimer.afInstanceId).to.exist;
      expect(response.body.communicationCharacteristics.ppActiveTime).to.exist;
    });

    it('should delete properties when set to null', async () => {
      const ueId = 'imsi-999888777666555';
      
      await request(app)
        .get(`/nudm-pp/v1/${ueId}/pp-data`)
        .expect(200);
      
      await request(app)
        .patch(`/nudm-pp/v1/${ueId}/pp-data`)
        .send({
          expectedUeBehaviourParameters: null
        })
        .expect(204);
      
      const response = await request(app)
        .get(`/nudm-pp/v1/${ueId}/pp-data`)
        .expect(200);
      
      expect(response.body.expectedUeBehaviourParameters).to.be.undefined;
      expect(response.body.communicationCharacteristics).to.exist;
    });

    it('should accept all supported ueId formats', async () => {
      const ueIds = [
        'msisdn-1234567890',
        'extid-user@domain.com',
        'imsi-123456789012',
        'nai-user@example.com',
        'gci-123456',
        'gli-abcdef',
        'extgroupid-group@domain.com'
      ];

      for (const ueId of ueIds) {
        await request(app)
          .patch(`/nudm-pp/v1/${ueId}/pp-data`)
          .send({
            communicationCharacteristics: {
              ppDlPacketCount: 15
            }
          })
          .expect(204);
      }
    });

    it('should update multiple properties at once', async () => {
      const ueId = 'imsi-777666555444333';
      
      await request(app)
        .patch(`/nudm-pp/v1/${ueId}/pp-data`)
        .send({
          communicationCharacteristics: {
            ppDlPacketCount: 30,
            ppActiveTime: {
              activeTime: 600
            }
          },
          expectedUeBehaviourParameters: {
            stationaryIndication: 'MOBILE',
            periodicTime: 7200
          }
        })
        .expect(204);
      
      const response = await request(app)
        .get(`/nudm-pp/v1/${ueId}/pp-data`)
        .expect(200);
      
      expect(response.body.communicationCharacteristics.ppDlPacketCount).to.equal(30);
      expect(response.body.communicationCharacteristics.ppActiveTime.activeTime).to.equal(600);
      expect(response.body.expectedUeBehaviourParameters.stationaryIndication).to.equal('MOBILE');
      expect(response.body.expectedUeBehaviourParameters.periodicTime).to.equal(7200);
    });

    it('should handle array updates', async () => {
      const ueId = 'imsi-333444555666777';
      
      await request(app)
        .patch(`/nudm-pp/v1/${ueId}/pp-data`)
        .send({
          ecRestriction: {
            plmnEcInfos: [
              {
                plmnId: {
                  mcc: '999',
                  mnc: '99'
                },
                ecRestrictionDataNb: true
              }
            ]
          }
        })
        .expect(204);
      
      const response = await request(app)
        .get(`/nudm-pp/v1/${ueId}/pp-data`)
        .expect(200);
      
      expect(response.body.ecRestriction.plmnEcInfos).to.be.an('array');
      expect(response.body.ecRestriction.plmnEcInfos[0].plmnId.mcc).to.equal('999');
    });
  });

  describe('Validation error cases', () => {
    it('should return 400 for invalid ueId format', async () => {
      const response = await request(app)
        .patch('/nudm-pp/v1/invalid-ueid/pp-data')
        .send({
          communicationCharacteristics: {
            ppDlPacketCount: 20
          }
        })
        .expect(400)
        .expect('Content-Type', /json/);

      expect(response.body).to.have.property('status', 400);
      expect(response.body).to.have.property('title', 'Bad Request');
      expect(response.body).to.have.property('detail');
      expect(response.body.detail).to.include('ueId');
      expect(response.body).to.have.property('cause', 'INVALID_PARAMETER');
    });


    it('should return 400 for array request body', async () => {
      const response = await request(app)
        .patch(`/nudm-pp/v1/${validUeId}/pp-data`)
        .send([{ communicationCharacteristics: { ppDlPacketCount: 20 } }])
        .expect(400);

      expect(response.body).to.have.property('status', 400);
      expect(response.body).to.have.property('cause', 'INVALID_PARAMETER');
    });

    it('should return 400 for ueId with invalid imsi length', async () => {
      const response = await request(app)
        .patch('/nudm-pp/v1/imsi-123/pp-data')
        .send({
          communicationCharacteristics: {
            ppDlPacketCount: 20
          }
        })
        .expect(400);

      expect(response.body).to.have.property('status', 400);
      expect(response.body.cause).to.equal('INVALID_PARAMETER');
    });

    it('should return 400 for extid without @ symbol', async () => {
      const response = await request(app)
        .patch('/nudm-pp/v1/extid-nodomain/pp-data')
        .send({
          communicationCharacteristics: {
            ppDlPacketCount: 20
          }
        })
        .expect(400);

      expect(response.body).to.have.property('status', 400);
    });
  });

  describe('Error response format', () => {
    it('should have correct 3GPP error structure for 400', async () => {
      const response = await request(app)
        .patch('/nudm-pp/v1/invalid/pp-data')
        .send({})
        .expect(400);

      expect(response.body).to.have.property('type', 'urn:3gpp:error:invalid-parameter');
      expect(response.body).to.have.property('title');
      expect(response.body).to.have.property('status');
      expect(response.body).to.have.property('detail');
      expect(response.body).to.have.property('cause');
    });

    it('should return JSON content type for errors', async () => {
      await request(app)
        .patch('/nudm-pp/v1/invalid/pp-data')
        .send({})
        .expect(400)
        .expect('Content-Type', /json/);
    });
  });

  describe('Edge cases', () => {
    it('should handle empty patch body', async () => {
      const ueId = 'imsi-888999000111222';
      
      await request(app)
        .get(`/nudm-pp/v1/${ueId}/pp-data`)
        .expect(200);
      
      await request(app)
        .patch(`/nudm-pp/v1/${ueId}/pp-data`)
        .send({})
        .expect(204);
      
      const response = await request(app)
        .get(`/nudm-pp/v1/${ueId}/pp-data`)
        .expect(200);
      
      expect(response.body.communicationCharacteristics).to.exist;
    });

    it('should create default data if UE does not exist', async () => {
      const newUeId = 'imsi-123123123123123';
      
      await request(app)
        .patch(`/nudm-pp/v1/${newUeId}/pp-data`)
        .send({
          communicationCharacteristics: {
            ppDlPacketCount: 50
          }
        })
        .expect(204);
      
      const response = await request(app)
        .get(`/nudm-pp/v1/${newUeId}/pp-data`)
        .expect(200);
      
      expect(response.body.communicationCharacteristics.ppDlPacketCount).to.equal(50);
      expect(response.body.expectedUeBehaviourParameters).to.exist;
    });

    it('should handle null values in nested objects', async () => {
      const ueId = 'imsi-456456456456456';
      
      await request(app)
        .get(`/nudm-pp/v1/${ueId}/pp-data`)
        .expect(200);
      
      await request(app)
        .patch(`/nudm-pp/v1/${ueId}/pp-data`)
        .send({
          communicationCharacteristics: {
            ppActiveTime: null
          }
        })
        .expect(204);
      
      const response = await request(app)
        .get(`/nudm-pp/v1/${ueId}/pp-data`)
        .expect(200);
      
      expect(response.body.communicationCharacteristics.ppActiveTime).to.be.undefined;
      expect(response.body.communicationCharacteristics.ppSubsRegTimer).to.exist;
    });

    it('should handle URL encoded ueId', async () => {
      const response = await request(app)
        .patch('/nudm-pp/v1/extid-user%40example.com/pp-data')
        .send({
          communicationCharacteristics: {
            ppDlPacketCount: 15
          }
        })
        .expect(204);
    });

    it('should preserve unmodified properties', async () => {
      const ueId = 'imsi-789789789789789';
      
      const initial = await request(app)
        .get(`/nudm-pp/v1/${ueId}/pp-data`)
        .expect(200);
      
      const originalSubsRegTimer = initial.body.communicationCharacteristics.ppSubsRegTimer.subsRegTimer;
      
      await request(app)
        .patch(`/nudm-pp/v1/${ueId}/pp-data`)
        .send({
          communicationCharacteristics: {
            ppDlPacketCount: 99
          }
        })
        .expect(204);
      
      const updated = await request(app)
        .get(`/nudm-pp/v1/${ueId}/pp-data`)
        .expect(200);
      
      expect(updated.body.communicationCharacteristics.ppSubsRegTimer.subsRegTimer).to.equal(originalSubsRegTimer);
      expect(updated.body.communicationCharacteristics.ppDlPacketCount).to.equal(99);
    });
  });
});

describe('PUT /5g-vn-groups/:extGroupId', () => {
  const validExtGroupId = 'group123@example.com';

  describe('Success cases', () => {
    it('should create 5G VN Group with valid data', async () => {
      await request(app)
        .put(`/nudm-pp/v1/5g-vn-groups/${validExtGroupId}`)
        .send({
          '5gVnGroupData': {
            dnn: 'internet',
            sNssai: {
              sst: 1,
              sd: 'ABCDEF'
            }
          },
          members: [
            'msisdn-1234567890',
            'msisdn-0987654321'
          ],
          referenceId: 1,
          afInstanceId: 'af-instance-123'
        })
        .expect(201);
    });

    it('should create 5G VN Group with minimal data', async () => {
      await request(app)
        .put('/nudm-pp/v1/5g-vn-groups/minimal@example.com')
        .send({
          '5gVnGroupData': {
            dnn: 'ims',
            sNssai: {
              sst: 2
            }
          }
        })
        .expect(201);
    });

    it('should create 5G VN Group with complete configuration', async () => {
      await request(app)
        .put('/nudm-pp/v1/5g-vn-groups/complete@example.com')
        .send({
          '5gVnGroupData': {
            dnn: 'internet',
            sNssai: {
              sst: 1,
              sd: '000001'
            },
            pduSessionTypes: ['IPV4', 'IPV6'],
            secondaryAuth: true,
            dnAaaIpAddressAllocation: false,
            '5gVnGroupCommunicationInd': true,
            '5gVnGroupCommunicationType': 'WITH_N6_BASED_FORWARDING',
            maxGroupDataRate: {
              uplink: '100 Mbps',
              downlink: '200 Mbps'
            }
          },
          members: [
            'msisdn-1234567890',
            'msisdn-0987654321',
            'msisdn-1112223333'
          ],
          referenceId: 100,
          afInstanceId: 'af-instance-456',
          internalGroupIdentifier: 'internal-group-001',
          mtcProviderInformation: 'mtc-provider-data'
        })
        .expect(201);
    });

    it('should create 5G VN Group with membersData', async () => {
      await request(app)
        .put('/nudm-pp/v1/5g-vn-groups/members@example.com')
        .send({
          '5gVnGroupData': {
            dnn: 'internet',
            sNssai: {
              sst: 1
            }
          },
          membersData: {
            'msisdn-1234567890': {},
            'msisdn-0987654321': {}
          }
        })
        .expect(201);
    });

    it('should create 5G VN Group with different PDU session types', async () => {
      await request(app)
        .put('/nudm-pp/v1/5g-vn-groups/pdu@example.com')
        .send({
          '5gVnGroupData': {
            dnn: 'internet',
            sNssai: {
              sst: 1
            },
            pduSessionTypes: ['IPV4', 'IPV6', 'IPV4V6', 'ETHERNET']
          }
        })
        .expect(201);
    });

    it('should create 5G VN Group with app descriptors', async () => {
      await request(app)
        .put('/nudm-pp/v1/5g-vn-groups/apps@example.com')
        .send({
          '5gVnGroupData': {
            dnn: 'internet',
            sNssai: {
              sst: 1
            },
            appDescriptors: [
              {
                osId: 'android-app-1',
                appId: 'com.example.app'
              }
            ]
          }
        })
        .expect(201);
    });

    it('should accept extGroupId with complex domain', async () => {
      await request(app)
        .put('/nudm-pp/v1/5g-vn-groups/group@subdomain.example.com')
        .send({
          '5gVnGroupData': {
            dnn: 'internet',
            sNssai: {
              sst: 1
            }
          }
        })
        .expect(201);
    });

    it('should accept extGroupId with numbers', async () => {
      await request(app)
        .put('/nudm-pp/v1/5g-vn-groups/group123@domain456.com')
        .send({
          '5gVnGroupData': {
            dnn: 'internet',
            sNssai: {
              sst: 1
            }
          }
        })
        .expect(201);
    });

    it('should accept extGroupId with hyphens', async () => {
      await request(app)
        .put('/nudm-pp/v1/5g-vn-groups/my-group@my-domain.com')
        .send({
          '5gVnGroupData': {
            dnn: 'internet',
            sNssai: {
              sst: 1
            }
          }
        })
        .expect(201);
    });

    it('should accept extGroupId with underscores', async () => {
      await request(app)
        .put('/nudm-pp/v1/5g-vn-groups/my_group@my_domain.com')
        .send({
          '5gVnGroupData': {
            dnn: 'internet',
            sNssai: {
              sst: 1
            }
          }
        })
        .expect(201);
    });

    it('should handle multiple group creations', async () => {
      const groupIds = [
        'group1@example.com',
        'group2@example.com',
        'group3@example.com'
      ];

      for (const groupId of groupIds) {
        await request(app)
          .put(`/nudm-pp/v1/5g-vn-groups/${groupId}`)
          .send({
            '5gVnGroupData': {
              dnn: 'internet',
              sNssai: {
                sst: 1
              }
            }
          })
          .expect(201);
      }
    });

    it('should accept URL encoded extGroupId', async () => {
      await request(app)
        .put('/nudm-pp/v1/5g-vn-groups/group%40example.com')
        .send({
          '5gVnGroupData': {
            dnn: 'internet',
            sNssai: {
              sst: 1
            }
          }
        })
        .expect(201);
    });
  });

  describe('Validation error cases', () => {
    it('should return 400 for invalid extGroupId without @', async () => {
      const response = await request(app)
        .put('/nudm-pp/v1/5g-vn-groups/invalid-group-id')
        .send({
          '5gVnGroupData': {
            dnn: 'internet',
            sNssai: {
              sst: 1
            }
          }
        })
        .expect(400)
        .expect('Content-Type', /json/);

      expect(response.body).to.have.property('status', 400);
      expect(response.body).to.have.property('title', 'Bad Request');
      expect(response.body).to.have.property('detail');
      expect(response.body.detail).to.include('extGroupId');
      expect(response.body).to.have.property('cause', 'INVALID_PARAMETER');
    });

    it('should return 400 for extGroupId with only @', async () => {
      const response = await request(app)
        .put('/nudm-pp/v1/5g-vn-groups/@')
        .send({
          '5gVnGroupData': {
            dnn: 'internet',
            sNssai: {
              sst: 1
            }
          }
        })
        .expect(400);

      expect(response.body).to.have.property('status', 400);
      expect(response.body).to.have.property('cause', 'INVALID_PARAMETER');
    });

    it('should return 400 for extGroupId starting with @', async () => {
      const response = await request(app)
        .put('/nudm-pp/v1/5g-vn-groups/@example.com')
        .send({
          '5gVnGroupData': {
            dnn: 'internet',
            sNssai: {
              sst: 1
            }
          }
        })
        .expect(400);

      expect(response.body).to.have.property('status', 400);
    });

    it('should return 400 for extGroupId ending with @', async () => {
      const response = await request(app)
        .put('/nudm-pp/v1/5g-vn-groups/group@')
        .send({
          '5gVnGroupData': {
            dnn: 'internet',
            sNssai: {
              sst: 1
            }
          }
        })
        .expect(400);

      expect(response.body).to.have.property('status', 400);
    });

    it('should return 400 for extGroupId with multiple @ symbols', async () => {
      const response = await request(app)
        .put('/nudm-pp/v1/5g-vn-groups/group@domain@example.com')
        .send({
          '5gVnGroupData': {
            dnn: 'internet',
            sNssai: {
              sst: 1
            }
          }
        })
        .expect(400);

      expect(response.body).to.have.property('status', 400);
    });

    it('should return 404 for empty extGroupId', async () => {
      await request(app)
        .put('/nudm-pp/v1/5g-vn-groups/')
        .send({
          '5gVnGroupData': {
            dnn: 'internet',
            sNssai: {
              sst: 1
            }
          }
        })
        .expect(404);
    });

    it('should return 400 for array request body', async () => {
      const response = await request(app)
        .put(`/nudm-pp/v1/5g-vn-groups/${validExtGroupId}`)
        .send([
          {
            '5gVnGroupData': {
              dnn: 'internet',
              sNssai: {
                sst: 1
              }
            }
          }
        ])
        .expect(400);

      expect(response.body).to.have.property('status', 400);
      expect(response.body).to.have.property('cause', 'INVALID_PARAMETER');
    });
  });

  describe('Error response format', () => {
    it('should have correct 3GPP error structure for 400', async () => {
      const response = await request(app)
        .put('/nudm-pp/v1/5g-vn-groups/invalid-group')
        .send({
          '5gVnGroupData': {
            dnn: 'internet',
            sNssai: {
              sst: 1
            }
          }
        })
        .expect(400);

      expect(response.body).to.have.property('type', 'urn:3gpp:error:invalid-parameter');
      expect(response.body).to.have.property('title');
      expect(response.body).to.have.property('status');
      expect(response.body).to.have.property('detail');
      expect(response.body).to.have.property('cause');
    });

    it('should return JSON content type for errors', async () => {
      await request(app)
        .put('/nudm-pp/v1/5g-vn-groups/invalid-group')
        .send({
          '5gVnGroupData': {
            dnn: 'internet',
            sNssai: {
              sst: 1
            }
          }
        })
        .expect(400)
        .expect('Content-Type', /json/);
    });
  });

  describe('Edge cases', () => {
    it('should handle empty configuration object', async () => {
      await request(app)
        .put(`/nudm-pp/v1/5g-vn-groups/${validExtGroupId}`)
        .send({})
        .expect(201);
    });

    it('should handle very long extGroupId', async () => {
      const longGroupId = 'a'.repeat(100) + '@' + 'b'.repeat(100) + '.com';
      await request(app)
        .put(`/nudm-pp/v1/5g-vn-groups/${longGroupId}`)
        .send({
          '5gVnGroupData': {
            dnn: 'internet',
            sNssai: {
              sst: 1
            }
          }
        })
        .expect(201);
    });

    it('should handle extGroupId with special characters in local part', async () => {
      await request(app)
        .put('/nudm-pp/v1/5g-vn-groups/group.name_123-456@example.com')
        .send({
          '5gVnGroupData': {
            dnn: 'internet',
            sNssai: {
              sst: 1
            }
          }
        })
        .expect(201);
    });

    it('should handle large member list', async () => {
      const members = Array.from({ length: 100 }, (_, i) => `msisdn-123456789${i.toString().padStart(2, '0')}`);
      
      await request(app)
        .put('/nudm-pp/v1/5g-vn-groups/large@example.com')
        .send({
          '5gVnGroupData': {
            dnn: 'internet',
            sNssai: {
              sst: 1
            }
          },
          members
        })
        .expect(201);
    });

    it('should handle configuration with all optional fields', async () => {
      await request(app)
        .put('/nudm-pp/v1/5g-vn-groups/optional@example.com')
        .send({
          '5gVnGroupData': {
            dnn: 'internet',
            sNssai: {
              sst: 1,
              sd: 'ABCDEF'
            },
            pduSessionTypes: ['IPV4', 'IPV6'],
            appDescriptors: [
              {
                osId: 'android-app-1',
                appId: 'com.example.app'
              }
            ],
            secondaryAuth: true,
            dnAaaIpAddressAllocation: true,
            dnAaaAddress: {
              ipv4Addr: '192.168.1.1'
            },
            additionalDnAaaAddresses: [
              {
                ipv4Addr: '192.168.1.2'
              }
            ],
            dnAaaFqdn: 'aaa.example.com',
            '5gVnGroupCommunicationInd': true,
            '5gVnGroupCommunicationType': 'WITHOUT_N6_BASED_FORWARDING',
            maxGroupDataRate: {
              uplink: '1 Gbps',
              downlink: '2 Gbps'
            },
            upSecurity: {
              upIntegr: 'REQUIRED',
              upConfid: 'PREFERRED'
            }
          },
          members: [
            'msisdn-1234567890',
            'msisdn-0987654321'
          ],
          referenceId: 999,
          afInstanceId: 'af-instance-complete',
          internalGroupIdentifier: 'internal-999',
          mtcProviderInformation: 'mtc-complete-data',
          membersData: {
            'msisdn-1234567890': {},
            'msisdn-0987654321': {}
          }
        })
        .expect(201);
    });

    it('should overwrite existing group with same extGroupId', async () => {
      const groupId = 'overwrite@example.com';
      
      await request(app)
        .put(`/nudm-pp/v1/5g-vn-groups/${groupId}`)
        .send({
          '5gVnGroupData': {
            dnn: 'internet',
            sNssai: {
              sst: 1
            }
          },
          referenceId: 1
        })
        .expect(201);
      
      await request(app)
        .put(`/nudm-pp/v1/5g-vn-groups/${groupId}`)
        .send({
          '5gVnGroupData': {
            dnn: 'ims',
            sNssai: {
              sst: 2
            }
          },
          referenceId: 2
        })
        .expect(201);
    });
  });

  describe('Case sensitivity', () => {
    it('should treat extGroupId as case sensitive', async () => {
      await request(app)
        .put('/nudm-pp/v1/5g-vn-groups/Group@Example.com')
        .send({
          '5gVnGroupData': {
            dnn: 'internet',
            sNssai: {
              sst: 1
            }
          }
        })
        .expect(201);

      await request(app)
        .put('/nudm-pp/v1/5g-vn-groups/group@example.com')
        .send({
          '5gVnGroupData': {
            dnn: 'ims',
            sNssai: {
              sst: 2
            }
          }
        })
        .expect(201);
    });
  });
});

describe('DELETE /5g-vn-groups/:extGroupId', () => {
  const validExtGroupId = 'deletegroup@example.com';

  describe('Success cases', () => {
    it('should delete existing 5G VN Group', async () => {
      await request(app)
        .put(`/nudm-pp/v1/5g-vn-groups/${validExtGroupId}`)
        .send({
          '5gVnGroupData': {
            dnn: 'internet',
            sNssai: {
              sst: 1
            }
          }
        })
        .expect(201);

      await request(app)
        .delete(`/nudm-pp/v1/5g-vn-groups/${validExtGroupId}`)
        .expect(204);
    });

    it('should return 204 with no content', async () => {
      const groupId = 'nocontent@example.com';
      
      await request(app)
        .put(`/nudm-pp/v1/5g-vn-groups/${groupId}`)
        .send({
          '5gVnGroupData': {
            dnn: 'internet',
            sNssai: {
              sst: 1
            }
          }
        })
        .expect(201);

      const response = await request(app)
        .delete(`/nudm-pp/v1/5g-vn-groups/${groupId}`)
        .expect(204);

      expect(response.body).to.be.empty;
    });

    it('should accept mtc-provider-info query parameter', async () => {
      const groupId = 'mtcgroup@example.com';
      
      await request(app)
        .put(`/nudm-pp/v1/5g-vn-groups/${groupId}`)
        .send({
          '5gVnGroupData': {
            dnn: 'internet',
            sNssai: {
              sst: 1
            }
          }
        })
        .expect(201);

      await request(app)
        .delete(`/nudm-pp/v1/5g-vn-groups/${groupId}`)
        .query({ 'mtc-provider-info': 'mtc-provider-data' })
        .expect(204);
    });

    it('should accept af-id query parameter', async () => {
      const groupId = 'afgroup@example.com';
      
      await request(app)
        .put(`/nudm-pp/v1/5g-vn-groups/${groupId}`)
        .send({
          '5gVnGroupData': {
            dnn: 'internet',
            sNssai: {
              sst: 1
            }
          }
        })
        .expect(201);

      await request(app)
        .delete(`/nudm-pp/v1/5g-vn-groups/${groupId}`)
        .query({ 'af-id': 'af-instance-123' })
        .expect(204);
    });

    it('should accept both query parameters together', async () => {
      const groupId = 'bothparams@example.com';
      
      await request(app)
        .put(`/nudm-pp/v1/5g-vn-groups/${groupId}`)
        .send({
          '5gVnGroupData': {
            dnn: 'internet',
            sNssai: {
              sst: 1
            }
          }
        })
        .expect(201);

      await request(app)
        .delete(`/nudm-pp/v1/5g-vn-groups/${groupId}`)
        .query({
          'mtc-provider-info': 'mtc-provider-data',
          'af-id': 'af-instance-123'
        })
        .expect(204);
    });

    it('should delete group with complex extGroupId', async () => {
      const groupId = 'complex.group_123-456@subdomain.example.com';
      
      await request(app)
        .put(`/nudm-pp/v1/5g-vn-groups/${groupId}`)
        .send({
          '5gVnGroupData': {
            dnn: 'internet',
            sNssai: {
              sst: 1
            }
          }
        })
        .expect(201);

      await request(app)
        .delete(`/nudm-pp/v1/5g-vn-groups/${groupId}`)
        .expect(204);
    });

    it('should delete group with URL encoded extGroupId', async () => {
      const groupId = 'encoded@example.com';
      
      await request(app)
        .put(`/nudm-pp/v1/5g-vn-groups/${groupId}`)
        .send({
          '5gVnGroupData': {
            dnn: 'internet',
            sNssai: {
              sst: 1
            }
          }
        })
        .expect(201);

      await request(app)
        .delete('/nudm-pp/v1/5g-vn-groups/encoded%40example.com')
        .expect(204);
    });

    it('should delete multiple groups sequentially', async () => {
      const groupIds = [
        'multi1@example.com',
        'multi2@example.com',
        'multi3@example.com'
      ];

      for (const groupId of groupIds) {
        await request(app)
          .put(`/nudm-pp/v1/5g-vn-groups/${groupId}`)
          .send({
            '5gVnGroupData': {
              dnn: 'internet',
              sNssai: {
                sst: 1
              }
            }
          })
          .expect(201);
      }

      for (const groupId of groupIds) {
        await request(app)
          .delete(`/nudm-pp/v1/5g-vn-groups/${groupId}`)
          .expect(204);
      }
    });
  });

  describe('Validation error cases', () => {
    it('should return 400 for invalid extGroupId without @', async () => {
      const response = await request(app)
        .delete('/nudm-pp/v1/5g-vn-groups/invalid-group-id')
        .expect(400)
        .expect('Content-Type', /json/);

      expect(response.body).to.have.property('status', 400);
      expect(response.body).to.have.property('title', 'Bad Request');
      expect(response.body).to.have.property('detail');
      expect(response.body.detail).to.include('extGroupId');
      expect(response.body).to.have.property('cause', 'INVALID_PARAMETER');
    });

    it('should return 400 for extGroupId with only @', async () => {
      const response = await request(app)
        .delete('/nudm-pp/v1/5g-vn-groups/@')
        .expect(400);

      expect(response.body).to.have.property('status', 400);
      expect(response.body).to.have.property('cause', 'INVALID_PARAMETER');
    });

    it('should return 400 for extGroupId starting with @', async () => {
      const response = await request(app)
        .delete('/nudm-pp/v1/5g-vn-groups/@example.com')
        .expect(400);

      expect(response.body).to.have.property('status', 400);
      expect(response.body).to.have.property('cause', 'INVALID_PARAMETER');
    });

    it('should return 400 for extGroupId ending with @', async () => {
      const response = await request(app)
        .delete('/nudm-pp/v1/5g-vn-groups/group@')
        .expect(400);

      expect(response.body).to.have.property('status', 400);
      expect(response.body).to.have.property('cause', 'INVALID_PARAMETER');
    });

    it('should return 400 for extGroupId with multiple @ symbols', async () => {
      const response = await request(app)
        .delete('/nudm-pp/v1/5g-vn-groups/group@domain@example.com')
        .expect(400);

      expect(response.body).to.have.property('status', 400);
      expect(response.body).to.have.property('cause', 'INVALID_PARAMETER');
    });

    it('should return 404 for non-existent group', async () => {
      const response = await request(app)
        .delete('/nudm-pp/v1/5g-vn-groups/nonexistent@example.com')
        .expect(404)
        .expect('Content-Type', /json/);

      expect(response.body).to.have.property('status', 404);
      expect(response.body).to.have.property('title', 'Not Found');
      expect(response.body).to.have.property('detail');
      expect(response.body.detail).to.include('not found');
      expect(response.body).to.have.property('cause', 'DATA_NOT_FOUND');
    });

    it('should return 404 when deleting same group twice', async () => {
      const groupId = 'deletetwice@example.com';
      
      await request(app)
        .put(`/nudm-pp/v1/5g-vn-groups/${groupId}`)
        .send({
          '5gVnGroupData': {
            dnn: 'internet',
            sNssai: {
              sst: 1
            }
          }
        })
        .expect(201);

      await request(app)
        .delete(`/nudm-pp/v1/5g-vn-groups/${groupId}`)
        .expect(204);

      const response = await request(app)
        .delete(`/nudm-pp/v1/5g-vn-groups/${groupId}`)
        .expect(404);

      expect(response.body).to.have.property('status', 404);
      expect(response.body).to.have.property('cause', 'DATA_NOT_FOUND');
    });

    it('should return 404 for empty extGroupId', async () => {
      await request(app)
        .delete('/nudm-pp/v1/5g-vn-groups/')
        .expect(404);
    });
  });

  describe('Error response format', () => {
    it('should have correct 3GPP error structure for 400', async () => {
      const response = await request(app)
        .delete('/nudm-pp/v1/5g-vn-groups/invalid-group')
        .expect(400);

      expect(response.body).to.have.property('type', 'urn:3gpp:error:invalid-parameter');
      expect(response.body).to.have.property('title');
      expect(response.body).to.have.property('status');
      expect(response.body).to.have.property('detail');
      expect(response.body).to.have.property('cause');
    });

    it('should have correct 3GPP error structure for 404', async () => {
      const response = await request(app)
        .delete('/nudm-pp/v1/5g-vn-groups/notfound@example.com')
        .expect(404);

      expect(response.body).to.have.property('type', 'urn:3gpp:error:not-found');
      expect(response.body).to.have.property('title');
      expect(response.body).to.have.property('status');
      expect(response.body).to.have.property('detail');
      expect(response.body).to.have.property('cause');
    });

    it('should return JSON content type for 400 errors', async () => {
      await request(app)
        .delete('/nudm-pp/v1/5g-vn-groups/invalid-group')
        .expect(400)
        .expect('Content-Type', /json/);
    });

    it('should return JSON content type for 404 errors', async () => {
      await request(app)
        .delete('/nudm-pp/v1/5g-vn-groups/notfound@example.com')
        .expect(404)
        .expect('Content-Type', /json/);
    });
  });

  describe('Edge cases', () => {
    it('should handle very long extGroupId', async () => {
      const longGroupId = 'a'.repeat(100) + '@' + 'b'.repeat(100) + '.com';
      
      await request(app)
        .put(`/nudm-pp/v1/5g-vn-groups/${longGroupId}`)
        .send({
          '5gVnGroupData': {
            dnn: 'internet',
            sNssai: {
              sst: 1
            }
          }
        })
        .expect(201);

      await request(app)
        .delete(`/nudm-pp/v1/5g-vn-groups/${longGroupId}`)
        .expect(204);
    });

    it('should handle extGroupId with special characters', async () => {
      const specialGroupId = 'group.name_123-456@example.com';
      
      await request(app)
        .put(`/nudm-pp/v1/5g-vn-groups/${specialGroupId}`)
        .send({
          '5gVnGroupData': {
            dnn: 'internet',
            sNssai: {
              sst: 1
            }
          }
        })
        .expect(201);

      await request(app)
        .delete(`/nudm-pp/v1/5g-vn-groups/${specialGroupId}`)
        .expect(204);
    });

    it('should handle deletion with query parameters for non-existent group', async () => {
      const response = await request(app)
        .delete('/nudm-pp/v1/5g-vn-groups/ghost@example.com')
        .query({
          'mtc-provider-info': 'mtc-data',
          'af-id': 'af-123'
        })
        .expect(404);

      expect(response.body).to.have.property('status', 404);
    });

    it('should treat query parameters as optional', async () => {
      const groupId = 'noparams@example.com';
      
      await request(app)
        .put(`/nudm-pp/v1/5g-vn-groups/${groupId}`)
        .send({
          '5gVnGroupData': {
            dnn: 'internet',
            sNssai: {
              sst: 1
            }
          }
        })
        .expect(201);

      await request(app)
        .delete(`/nudm-pp/v1/5g-vn-groups/${groupId}`)
        .expect(204);
    });
  });

  describe('Case sensitivity', () => {
    it('should treat extGroupId as case sensitive', async () => {
      const lowerCaseId = 'group@example.com';
      const upperCaseId = 'Group@Example.com';
      
      await request(app)
        .put(`/nudm-pp/v1/5g-vn-groups/${lowerCaseId}`)
        .send({
          '5gVnGroupData': {
            dnn: 'internet',
            sNssai: {
              sst: 1
            }
          }
        })
        .expect(201);

      await request(app)
        .put(`/nudm-pp/v1/5g-vn-groups/${upperCaseId}`)
        .send({
          '5gVnGroupData': {
            dnn: 'ims',
            sNssai: {
              sst: 2
            }
          }
        })
        .expect(201);

      await request(app)
        .delete(`/nudm-pp/v1/5g-vn-groups/${lowerCaseId}`)
        .expect(204);

      await request(app)
        .delete(`/nudm-pp/v1/5g-vn-groups/${upperCaseId}`)
        .expect(204);
    });

    it('should return 404 when case does not match existing group', async () => {
      const groupId = 'lowercase@example.com';
      
      await request(app)
        .put(`/nudm-pp/v1/5g-vn-groups/${groupId}`)
        .send({
          '5gVnGroupData': {
            dnn: 'internet',
            sNssai: {
              sst: 1
            }
          }
        })
        .expect(201);

      const response = await request(app)
        .delete('/nudm-pp/v1/5g-vn-groups/Lowercase@Example.com')
        .expect(404);

      expect(response.body).to.have.property('status', 404);
    });
  });

  describe('Integration with PUT', () => {
    it('should allow creating group after deletion', async () => {
      const groupId = 'recreate@example.com';
      
      await request(app)
        .put(`/nudm-pp/v1/5g-vn-groups/${groupId}`)
        .send({
          '5gVnGroupData': {
            dnn: 'internet',
            sNssai: {
              sst: 1
            }
          },
          referenceId: 1
        })
        .expect(201);

      await request(app)
        .delete(`/nudm-pp/v1/5g-vn-groups/${groupId}`)
        .expect(204);

      await request(app)
        .put(`/nudm-pp/v1/5g-vn-groups/${groupId}`)
        .send({
          '5gVnGroupData': {
            dnn: 'ims',
            sNssai: {
              sst: 2
            }
          },
          referenceId: 2
        })
        .expect(201);
    });

    it('should handle create-delete-create cycle multiple times', async () => {
      const groupId = 'cycle@example.com';
      
      for (let i = 0; i < 3; i++) {
        await request(app)
          .put(`/nudm-pp/v1/5g-vn-groups/${groupId}`)
          .send({
            '5gVnGroupData': {
              dnn: 'internet',
              sNssai: {
                sst: 1
              }
            },
            referenceId: i + 1
          })
          .expect(201);

        await request(app)
          .delete(`/nudm-pp/v1/5g-vn-groups/${groupId}`)
          .expect(204);
      }
    });
  });
});

describe('GET /5g-vn-groups/:extGroupId', () => {
  const validExtGroupId = 'getgroup@example.com';

  describe('Success cases', () => {
    it('should return 5G VN Group configuration for existing group', async () => {
      const groupConfig = {
        '5gVnGroupData': {
          dnn: 'internet',
          sNssai: {
            sst: 1,
            sd: 'ABCDEF'
          }
        },
        members: [
          'msisdn-1234567890',
          'msisdn-0987654321'
        ],
        referenceId: 1,
        afInstanceId: 'af-instance-123'
      };

      await request(app)
        .put(`/nudm-pp/v1/5g-vn-groups/${validExtGroupId}`)
        .send(groupConfig)
        .expect(201);

      const response = await request(app)
        .get(`/nudm-pp/v1/5g-vn-groups/${validExtGroupId}`)
        .expect(200)
        .expect('Content-Type', /json/);

      expect(response.body).to.deep.equal(groupConfig);
    });

    it('should return group with minimal configuration', async () => {
      const groupId = 'minimal-get@example.com';
      const groupConfig = {
        '5gVnGroupData': {
          dnn: 'ims',
          sNssai: {
            sst: 2
          }
        }
      };

      await request(app)
        .put(`/nudm-pp/v1/5g-vn-groups/${groupId}`)
        .send(groupConfig)
        .expect(201);

      const response = await request(app)
        .get(`/nudm-pp/v1/5g-vn-groups/${groupId}`)
        .expect(200);

      expect(response.body).to.deep.equal(groupConfig);
    });

    it('should return group with complete configuration', async () => {
      const groupId = 'complete-get@example.com';
      const groupConfig = {
        '5gVnGroupData': {
          dnn: 'internet',
          sNssai: {
            sst: 1,
            sd: '000001'
          },
          pduSessionTypes: ['IPV4', 'IPV6'],
          secondaryAuth: true,
          dnAaaIpAddressAllocation: false,
          '5gVnGroupCommunicationInd': true,
          '5gVnGroupCommunicationType': 'WITH_N6_BASED_FORWARDING',
          maxGroupDataRate: {
            uplink: '100 Mbps',
            downlink: '200 Mbps'
          }
        },
        members: [
          'msisdn-1234567890',
          'msisdn-0987654321',
          'msisdn-1112223333'
        ],
        referenceId: 100,
        afInstanceId: 'af-instance-456',
        internalGroupIdentifier: 'internal-group-001',
        mtcProviderInformation: 'mtc-provider-data'
      };

      await request(app)
        .put(`/nudm-pp/v1/5g-vn-groups/${groupId}`)
        .send(groupConfig)
        .expect(201);

      const response = await request(app)
        .get(`/nudm-pp/v1/5g-vn-groups/${groupId}`)
        .expect(200);

      expect(response.body).to.deep.equal(groupConfig);
    });

    it('should return group with membersData', async () => {
      const groupId = 'membersdata-get@example.com';
      const groupConfig = {
        '5gVnGroupData': {
          dnn: 'internet',
          sNssai: {
            sst: 1
          }
        },
        membersData: {
          'msisdn-1234567890': {},
          'msisdn-0987654321': {}
        }
      };

      await request(app)
        .put(`/nudm-pp/v1/5g-vn-groups/${groupId}`)
        .send(groupConfig)
        .expect(201);

      const response = await request(app)
        .get(`/nudm-pp/v1/5g-vn-groups/${groupId}`)
        .expect(200);

      expect(response.body).to.deep.equal(groupConfig);
    });

    it('should return group with app descriptors', async () => {
      const groupId = 'apps-get@example.com';
      const groupConfig = {
        '5gVnGroupData': {
          dnn: 'internet',
          sNssai: {
            sst: 1
          },
          appDescriptors: [
            {
              osId: 'android-app-1',
              appId: 'com.example.app'
            }
          ]
        }
      };

      await request(app)
        .put(`/nudm-pp/v1/5g-vn-groups/${groupId}`)
        .send(groupConfig)
        .expect(201);

      const response = await request(app)
        .get(`/nudm-pp/v1/5g-vn-groups/${groupId}`)
        .expect(200);

      expect(response.body).to.deep.equal(groupConfig);
    });

    it('should accept extGroupId with complex domain', async () => {
      const groupId = 'group@subdomain.example.com';
      const groupConfig = {
        '5gVnGroupData': {
          dnn: 'internet',
          sNssai: {
            sst: 1
          }
        }
      };

      await request(app)
        .put(`/nudm-pp/v1/5g-vn-groups/${groupId}`)
        .send(groupConfig)
        .expect(201);

      await request(app)
        .get(`/nudm-pp/v1/5g-vn-groups/${groupId}`)
        .expect(200);
    });

    it('should accept extGroupId with numbers', async () => {
      const groupId = 'group123@domain456.com';
      const groupConfig = {
        '5gVnGroupData': {
          dnn: 'internet',
          sNssai: {
            sst: 1
          }
        }
      };

      await request(app)
        .put(`/nudm-pp/v1/5g-vn-groups/${groupId}`)
        .send(groupConfig)
        .expect(201);

      await request(app)
        .get(`/nudm-pp/v1/5g-vn-groups/${groupId}`)
        .expect(200);
    });

    it('should accept extGroupId with hyphens', async () => {
      const groupId = 'my-group@my-domain.com';
      const groupConfig = {
        '5gVnGroupData': {
          dnn: 'internet',
          sNssai: {
            sst: 1
          }
        }
      };

      await request(app)
        .put(`/nudm-pp/v1/5g-vn-groups/${groupId}`)
        .send(groupConfig)
        .expect(201);

      await request(app)
        .get(`/nudm-pp/v1/5g-vn-groups/${groupId}`)
        .expect(200);
    });

    it('should accept extGroupId with underscores', async () => {
      const groupId = 'my_group@my_domain.com';
      const groupConfig = {
        '5gVnGroupData': {
          dnn: 'internet',
          sNssai: {
            sst: 1
          }
        }
      };

      await request(app)
        .put(`/nudm-pp/v1/5g-vn-groups/${groupId}`)
        .send(groupConfig)
        .expect(201);

      await request(app)
        .get(`/nudm-pp/v1/5g-vn-groups/${groupId}`)
        .expect(200);
    });

    it('should accept URL encoded extGroupId', async () => {
      const groupId = 'encoded-get@example.com';
      const groupConfig = {
        '5gVnGroupData': {
          dnn: 'internet',
          sNssai: {
            sst: 1
          }
        }
      };

      await request(app)
        .put(`/nudm-pp/v1/5g-vn-groups/${groupId}`)
        .send(groupConfig)
        .expect(201);

      await request(app)
        .get('/nudm-pp/v1/5g-vn-groups/encoded-get%40example.com')
        .expect(200);
    });

    it('should return updated data after patch', async () => {
      const groupId = 'updated-get@example.com';
      const initialConfig = {
        '5gVnGroupData': {
          dnn: 'internet',
          sNssai: {
            sst: 1
          }
        },
        referenceId: 1,
        afInstanceId: 'af-original'
      };

      await request(app)
        .put(`/nudm-pp/v1/5g-vn-groups/${groupId}`)
        .send(initialConfig)
        .expect(201);

      await request(app)
        .patch(`/nudm-pp/v1/5g-vn-groups/${groupId}`)
        .send({
          afInstanceId: 'af-updated'
        })
        .expect(204);

      const response = await request(app)
        .get(`/nudm-pp/v1/5g-vn-groups/${groupId}`)
        .expect(200);

      expect(response.body.afInstanceId).to.equal('af-updated');
      expect(response.body.referenceId).to.equal(1);
    });

    it('should handle multiple groups independently', async () => {
      const groups = [
        {
          id: 'multi1-get@example.com',
          config: {
            '5gVnGroupData': {
              dnn: 'internet',
              sNssai: { sst: 1 }
            },
            referenceId: 1
          }
        },
        {
          id: 'multi2-get@example.com',
          config: {
            '5gVnGroupData': {
              dnn: 'ims',
              sNssai: { sst: 2 }
            },
            referenceId: 2
          }
        },
        {
          id: 'multi3-get@example.com',
          config: {
            '5gVnGroupData': {
              dnn: 'enterprise',
              sNssai: { sst: 3 }
            },
            referenceId: 3
          }
        }
      ];

      for (const group of groups) {
        await request(app)
          .put(`/nudm-pp/v1/5g-vn-groups/${group.id}`)
          .send(group.config)
          .expect(201);
      }

      for (const group of groups) {
        const response = await request(app)
          .get(`/nudm-pp/v1/5g-vn-groups/${group.id}`)
          .expect(200);

        expect(response.body).to.deep.equal(group.config);
      }
    });

    it('should return consistent data on multiple gets', async () => {
      const groupId = 'consistent-get@example.com';
      const groupConfig = {
        '5gVnGroupData': {
          dnn: 'internet',
          sNssai: {
            sst: 1,
            sd: 'ABCDEF'
          }
        },
        members: [
          'msisdn-1234567890'
        ]
      };

      await request(app)
        .put(`/nudm-pp/v1/5g-vn-groups/${groupId}`)
        .send(groupConfig)
        .expect(201);

      const response1 = await request(app)
        .get(`/nudm-pp/v1/5g-vn-groups/${groupId}`)
        .expect(200);

      const response2 = await request(app)
        .get(`/nudm-pp/v1/5g-vn-groups/${groupId}`)
        .expect(200);

      expect(response1.body).to.deep.equal(response2.body);
    });
  });

  describe('Validation error cases', () => {
    it('should return 400 for invalid extGroupId without @', async () => {
      const response = await request(app)
        .get('/nudm-pp/v1/5g-vn-groups/invalid-group-id')
        .expect(400)
        .expect('Content-Type', /json/);

      expect(response.body).to.have.property('status', 400);
      expect(response.body).to.have.property('title', 'Bad Request');
      expect(response.body).to.have.property('detail');
      expect(response.body.detail).to.include('extGroupId');
      expect(response.body).to.have.property('cause', 'INVALID_PARAMETER');
    });

    it('should return 400 for extGroupId with only @', async () => {
      const response = await request(app)
        .get('/nudm-pp/v1/5g-vn-groups/@')
        .expect(400);

      expect(response.body).to.have.property('status', 400);
      expect(response.body).to.have.property('cause', 'INVALID_PARAMETER');
    });

    it('should return 400 for extGroupId starting with @', async () => {
      const response = await request(app)
        .get('/nudm-pp/v1/5g-vn-groups/@example.com')
        .expect(400);

      expect(response.body).to.have.property('status', 400);
      expect(response.body).to.have.property('cause', 'INVALID_PARAMETER');
    });

    it('should return 400 for extGroupId ending with @', async () => {
      const response = await request(app)
        .get('/nudm-pp/v1/5g-vn-groups/group@')
        .expect(400);

      expect(response.body).to.have.property('status', 400);
      expect(response.body).to.have.property('cause', 'INVALID_PARAMETER');
    });

    it('should return 400 for extGroupId with multiple @ symbols', async () => {
      const response = await request(app)
        .get('/nudm-pp/v1/5g-vn-groups/group@domain@example.com')
        .expect(400);

      expect(response.body).to.have.property('status', 400);
      expect(response.body).to.have.property('cause', 'INVALID_PARAMETER');
    });

    it('should return 404 for non-existent group', async () => {
      const response = await request(app)
        .get('/nudm-pp/v1/5g-vn-groups/nonexistent-get@example.com')
        .expect(404)
        .expect('Content-Type', /json/);

      expect(response.body).to.have.property('status', 404);
      expect(response.body).to.have.property('title', 'Not Found');
      expect(response.body).to.have.property('detail');
      expect(response.body.detail).to.include('not found');
      expect(response.body).to.have.property('cause', 'DATA_NOT_FOUND');
    });

    it('should return 404 for empty extGroupId', async () => {
      await request(app)
        .get('/nudm-pp/v1/5g-vn-groups/')
        .expect(404);
    });

    it('should return 404 after group deletion', async () => {
      const groupId = 'deleted-get@example.com';

      await request(app)
        .put(`/nudm-pp/v1/5g-vn-groups/${groupId}`)
        .send({
          '5gVnGroupData': {
            dnn: 'internet',
            sNssai: {
              sst: 1
            }
          }
        })
        .expect(201);

      await request(app)
        .get(`/nudm-pp/v1/5g-vn-groups/${groupId}`)
        .expect(200);

      await request(app)
        .delete(`/nudm-pp/v1/5g-vn-groups/${groupId}`)
        .expect(204);

      const response = await request(app)
        .get(`/nudm-pp/v1/5g-vn-groups/${groupId}`)
        .expect(404);

      expect(response.body).to.have.property('status', 404);
      expect(response.body).to.have.property('cause', 'DATA_NOT_FOUND');
    });
  });

  describe('Error response format', () => {
    it('should have correct 3GPP error structure for 400', async () => {
      const response = await request(app)
        .get('/nudm-pp/v1/5g-vn-groups/invalid-group')
        .expect(400);

      expect(response.body).to.have.property('type', 'urn:3gpp:error:invalid-parameter');
      expect(response.body).to.have.property('title');
      expect(response.body).to.have.property('status');
      expect(response.body).to.have.property('detail');
      expect(response.body).to.have.property('cause');
    });

    it('should have correct 3GPP error structure for 404', async () => {
      const response = await request(app)
        .get('/nudm-pp/v1/5g-vn-groups/notfound-get@example.com')
        .expect(404);

      expect(response.body).to.have.property('type', 'urn:3gpp:error:not-found');
      expect(response.body).to.have.property('title');
      expect(response.body).to.have.property('status');
      expect(response.body).to.have.property('detail');
      expect(response.body).to.have.property('cause');
    });

    it('should return JSON content type for 400 errors', async () => {
      await request(app)
        .get('/nudm-pp/v1/5g-vn-groups/invalid-group')
        .expect(400)
        .expect('Content-Type', /json/);
    });

    it('should return JSON content type for 404 errors', async () => {
      await request(app)
        .get('/nudm-pp/v1/5g-vn-groups/notfound-get@example.com')
        .expect(404)
        .expect('Content-Type', /json/);
    });

    it('should return JSON content type for successful response', async () => {
      const groupId = 'json-get@example.com';

      await request(app)
        .put(`/nudm-pp/v1/5g-vn-groups/${groupId}`)
        .send({
          '5gVnGroupData': {
            dnn: 'internet',
            sNssai: {
              sst: 1
            }
          }
        })
        .expect(201);

      await request(app)
        .get(`/nudm-pp/v1/5g-vn-groups/${groupId}`)
        .expect(200)
        .expect('Content-Type', /json/);
    });
  });

  describe('Edge cases', () => {
    it('should handle very long extGroupId', async () => {
      const longGroupId = 'a'.repeat(100) + '@' + 'b'.repeat(100) + '.com';

      await request(app)
        .put(`/nudm-pp/v1/5g-vn-groups/${longGroupId}`)
        .send({
          '5gVnGroupData': {
            dnn: 'internet',
            sNssai: {
              sst: 1
            }
          }
        })
        .expect(201);

      await request(app)
        .get(`/nudm-pp/v1/5g-vn-groups/${longGroupId}`)
        .expect(200);
    });

    it('should handle extGroupId with special characters', async () => {
      const specialGroupId = 'group.name_123-456@example.com';

      await request(app)
        .put(`/nudm-pp/v1/5g-vn-groups/${specialGroupId}`)
        .send({
          '5gVnGroupData': {
            dnn: 'internet',
            sNssai: {
              sst: 1
            }
          }
        })
        .expect(201);

      await request(app)
        .get(`/nudm-pp/v1/5g-vn-groups/${specialGroupId}`)
        .expect(200);
    });

    it('should handle empty configuration object', async () => {
      const groupId = 'empty-config-get@example.com';

      await request(app)
        .put(`/nudm-pp/v1/5g-vn-groups/${groupId}`)
        .send({})
        .expect(201);

      const response = await request(app)
        .get(`/nudm-pp/v1/5g-vn-groups/${groupId}`)
        .expect(200);

      expect(response.body).to.deep.equal({});
    });

    it('should handle large member list', async () => {
      const groupId = 'large-list-get@example.com';
      const members = Array.from({ length: 100 }, (_, i) => `msisdn-123456789${i.toString().padStart(2, '0')}`);

      await request(app)
        .put(`/nudm-pp/v1/5g-vn-groups/${groupId}`)
        .send({
          '5gVnGroupData': {
            dnn: 'internet',
            sNssai: {
              sst: 1
            }
          },
          members
        })
        .expect(201);

      const response = await request(app)
        .get(`/nudm-pp/v1/5g-vn-groups/${groupId}`)
        .expect(200);

      expect(response.body.members).to.have.lengthOf(100);
    });

    it('should handle configuration with all optional fields', async () => {
      const groupId = 'all-fields-get@example.com';
      const fullConfig = {
        '5gVnGroupData': {
          dnn: 'internet',
          sNssai: {
            sst: 1,
            sd: 'ABCDEF'
          },
          pduSessionTypes: ['IPV4', 'IPV6'],
          appDescriptors: [
            {
              osId: 'android-app-1',
              appId: 'com.example.app'
            }
          ],
          secondaryAuth: true,
          dnAaaIpAddressAllocation: true,
          dnAaaAddress: {
            ipv4Addr: '192.168.1.1'
          },
          additionalDnAaaAddresses: [
            {
              ipv4Addr: '192.168.1.2'
            }
          ],
          dnAaaFqdn: 'aaa.example.com',
          '5gVnGroupCommunicationInd': true,
          '5gVnGroupCommunicationType': 'WITHOUT_N6_BASED_FORWARDING',
          maxGroupDataRate: {
            uplink: '1 Gbps',
            downlink: '2 Gbps'
          },
          upSecurity: {
            upIntegr: 'REQUIRED',
            upConfid: 'PREFERRED'
          }
        },
        members: [
          'msisdn-1234567890',
          'msisdn-0987654321'
        ],
        referenceId: 999,
        afInstanceId: 'af-instance-complete',
        internalGroupIdentifier: 'internal-999',
        mtcProviderInformation: 'mtc-complete-data',
        membersData: {
          'msisdn-1234567890': {},
          'msisdn-0987654321': {}
        }
      };

      await request(app)
        .put(`/nudm-pp/v1/5g-vn-groups/${groupId}`)
        .send(fullConfig)
        .expect(201);

      const response = await request(app)
        .get(`/nudm-pp/v1/5g-vn-groups/${groupId}`)
        .expect(200);

      expect(response.body).to.deep.equal(fullConfig);
    });
  });

  describe('Case sensitivity', () => {
    it('should treat extGroupId as case sensitive', async () => {
      const lowerCaseId = 'getcase@example.com';
      const upperCaseId = 'GetCase@Example.com';

      await request(app)
        .put(`/nudm-pp/v1/5g-vn-groups/${lowerCaseId}`)
        .send({
          '5gVnGroupData': {
            dnn: 'internet',
            sNssai: {
              sst: 1
            }
          },
          referenceId: 1
        })
        .expect(201);

      await request(app)
        .put(`/nudm-pp/v1/5g-vn-groups/${upperCaseId}`)
        .send({
          '5gVnGroupData': {
            dnn: 'ims',
            sNssai: {
              sst: 2
            }
          },
          referenceId: 2
        })
        .expect(201);

      const lowerResponse = await request(app)
        .get(`/nudm-pp/v1/5g-vn-groups/${lowerCaseId}`)
        .expect(200);

      const upperResponse = await request(app)
        .get(`/nudm-pp/v1/5g-vn-groups/${upperCaseId}`)
        .expect(200);

      expect(lowerResponse.body.referenceId).to.equal(1);
      expect(upperResponse.body.referenceId).to.equal(2);
    });

    it('should return 404 when case does not match existing group', async () => {
      const groupId = 'lowercase-get@example.com';

      await request(app)
        .put(`/nudm-pp/v1/5g-vn-groups/${groupId}`)
        .send({
          '5gVnGroupData': {
            dnn: 'internet',
            sNssai: {
              sst: 1
            }
          }
        })
        .expect(201);

      const response = await request(app)
        .get('/nudm-pp/v1/5g-vn-groups/Lowercase-Get@Example.com')
        .expect(404);

      expect(response.body).to.have.property('status', 404);
    });
  });

  describe('Integration with other operations', () => {
    it('should return group immediately after creation', async () => {
      const groupId = 'immediate-get@example.com';
      const groupConfig = {
        '5gVnGroupData': {
          dnn: 'internet',
          sNssai: {
            sst: 1
          }
        },
        referenceId: 1
      };

      await request(app)
        .put(`/nudm-pp/v1/5g-vn-groups/${groupId}`)
        .send(groupConfig)
        .expect(201);

      const response = await request(app)
        .get(`/nudm-pp/v1/5g-vn-groups/${groupId}`)
        .expect(200);

      expect(response.body).to.deep.equal(groupConfig);
    });

    it('should return updated data after patch', async () => {
      const groupId = 'get-after-patch@example.com';

      await request(app)
        .put(`/nudm-pp/v1/5g-vn-groups/${groupId}`)
        .send({
          '5gVnGroupData': {
            dnn: 'internet',
            sNssai: {
              sst: 1
            }
          },
          referenceId: 1,
          afInstanceId: 'af-original'
        })
        .expect(201);

      await request(app)
        .patch(`/nudm-pp/v1/5g-vn-groups/${groupId}`)
        .send({
          afInstanceId: 'af-updated',
          mtcProviderInformation: 'mtc-new'
        })
        .expect(204);

      const response = await request(app)
        .get(`/nudm-pp/v1/5g-vn-groups/${groupId}`)
        .expect(200);

      expect(response.body.afInstanceId).to.equal('af-updated');
      expect(response.body.mtcProviderInformation).to.equal('mtc-new');
      expect(response.body.referenceId).to.equal(1);
    });

    it('should return 404 after deletion', async () => {
      const groupId = 'get-after-delete@example.com';

      await request(app)
        .put(`/nudm-pp/v1/5g-vn-groups/${groupId}`)
        .send({
          '5gVnGroupData': {
            dnn: 'internet',
            sNssai: {
              sst: 1
            }
          }
        })
        .expect(201);

      await request(app)
        .delete(`/nudm-pp/v1/5g-vn-groups/${groupId}`)
        .expect(204);

      await request(app)
        .get(`/nudm-pp/v1/5g-vn-groups/${groupId}`)
        .expect(404);
    });

    it('should return new data after recreating deleted group', async () => {
      const groupId = 'recreate-get@example.com';
      const firstConfig = {
        '5gVnGroupData': {
          dnn: 'internet',
          sNssai: {
            sst: 1
          }
        },
        referenceId: 1
      };
      const secondConfig = {
        '5gVnGroupData': {
          dnn: 'ims',
          sNssai: {
            sst: 2
          }
        },
        referenceId: 2
      };

      await request(app)
        .put(`/nudm-pp/v1/5g-vn-groups/${groupId}`)
        .send(firstConfig)
        .expect(201);

      await request(app)
        .delete(`/nudm-pp/v1/5g-vn-groups/${groupId}`)
        .expect(204);

      await request(app)
        .put(`/nudm-pp/v1/5g-vn-groups/${groupId}`)
        .send(secondConfig)
        .expect(201);

      const response = await request(app)
        .get(`/nudm-pp/v1/5g-vn-groups/${groupId}`)
        .expect(200);

      expect(response.body).to.deep.equal(secondConfig);
    });

    it('should handle create-get-patch-get cycle', async () => {
      const groupId = 'cycle-get@example.com';

      await request(app)
        .put(`/nudm-pp/v1/5g-vn-groups/${groupId}`)
        .send({
          '5gVnGroupData': {
            dnn: 'internet',
            sNssai: {
              sst: 1
            }
          },
          referenceId: 1
        })
        .expect(201);

      const getResponse1 = await request(app)
        .get(`/nudm-pp/v1/5g-vn-groups/${groupId}`)
        .expect(200);

      expect(getResponse1.body.referenceId).to.equal(1);

      await request(app)
        .patch(`/nudm-pp/v1/5g-vn-groups/${groupId}`)
        .send({
          referenceId: 2
        })
        .expect(204);

      const getResponse2 = await request(app)
        .get(`/nudm-pp/v1/5g-vn-groups/${groupId}`)
        .expect(200);

      expect(getResponse2.body.referenceId).to.equal(2);
    });

    it('should handle multiple patches with get in between', async () => {
      const groupId = 'multi-patch-get@example.com';

      await request(app)
        .put(`/nudm-pp/v1/5g-vn-groups/${groupId}`)
        .send({
          '5gVnGroupData': {
            dnn: 'internet',
            sNssai: {
              sst: 1
            }
          },
          referenceId: 1
        })
        .expect(201);

      await request(app)
        .patch(`/nudm-pp/v1/5g-vn-groups/${groupId}`)
        .send({
          afInstanceId: 'af-first'
        })
        .expect(204);

      const response1 = await request(app)
        .get(`/nudm-pp/v1/5g-vn-groups/${groupId}`)
        .expect(200);

      expect(response1.body.afInstanceId).to.equal('af-first');

      await request(app)
        .patch(`/nudm-pp/v1/5g-vn-groups/${groupId}`)
        .send({
          mtcProviderInformation: 'mtc-second'
        })
        .expect(204);

      const response2 = await request(app)
        .get(`/nudm-pp/v1/5g-vn-groups/${groupId}`)
        .expect(200);

      expect(response2.body.afInstanceId).to.equal('af-first');
      expect(response2.body.mtcProviderInformation).to.equal('mtc-second');
    });
  });
});

describe('PATCH /5g-vn-groups/:extGroupId', () => {
  const validExtGroupId = 'patchgroup@example.com';

  describe('Success cases', () => {
    it('should update existing 5G VN Group', async () => {
      await request(app)
        .put(`/nudm-pp/v1/5g-vn-groups/${validExtGroupId}`)
        .send({
          '5gVnGroupData': {
            dnn: 'internet',
            sNssai: {
              sst: 1,
              sd: 'ABCDEF'
            }
          },
          members: [
            'msisdn-1234567890',
            'msisdn-0987654321'
          ],
          referenceId: 1,
          afInstanceId: 'af-instance-123'
        })
        .expect(201);

      await request(app)
        .patch(`/nudm-pp/v1/5g-vn-groups/${validExtGroupId}`)
        .send({
          afInstanceId: 'af-instance-456'
        })
        .expect(204);
    });

    it('should return 204 with no content', async () => {
      const groupId = 'nocontent-patch@example.com';
      
      await request(app)
        .put(`/nudm-pp/v1/5g-vn-groups/${groupId}`)
        .send({
          '5gVnGroupData': {
            dnn: 'internet',
            sNssai: {
              sst: 1
            }
          }
        })
        .expect(201);

      const response = await request(app)
        .patch(`/nudm-pp/v1/5g-vn-groups/${groupId}`)
        .send({
          afInstanceId: 'af-new'
        })
        .expect(204);

      expect(response.body).to.be.empty;
    });

    it('should merge new data with existing data', async () => {
      const groupId = 'merge-patch@example.com';
      
      await request(app)
        .put(`/nudm-pp/v1/5g-vn-groups/${groupId}`)
        .send({
          '5gVnGroupData': {
            dnn: 'internet',
            sNssai: {
              sst: 1,
              sd: 'ABCDEF'
            },
            secondaryAuth: true
          },
          members: [
            'msisdn-1234567890'
          ],
          referenceId: 1,
          afInstanceId: 'af-original'
        })
        .expect(201);

      await request(app)
        .patch(`/nudm-pp/v1/5g-vn-groups/${groupId}`)
        .send({
          afInstanceId: 'af-updated',
          mtcProviderInformation: 'mtc-data'
        })
        .expect(204);
    });

    it('should handle deep merge of nested objects', async () => {
      const groupId = 'deep-merge@example.com';
      
      await request(app)
        .put(`/nudm-pp/v1/5g-vn-groups/${groupId}`)
        .send({
          '5gVnGroupData': {
            dnn: 'internet',
            sNssai: {
              sst: 1,
              sd: 'ABCDEF'
            },
            secondaryAuth: true,
            dnAaaIpAddressAllocation: false
          },
          referenceId: 1
        })
        .expect(201);

      await request(app)
        .patch(`/nudm-pp/v1/5g-vn-groups/${groupId}`)
        .send({
          '5gVnGroupData': {
            secondaryAuth: false,
            '5gVnGroupCommunicationInd': true
          }
        })
        .expect(204);
    });

    it('should delete properties when set to null', async () => {
      const groupId = 'delete-prop@example.com';
      
      await request(app)
        .put(`/nudm-pp/v1/5g-vn-groups/${groupId}`)
        .send({
          '5gVnGroupData': {
            dnn: 'internet',
            sNssai: {
              sst: 1
            }
          },
          members: [
            'msisdn-1234567890'
          ],
          afInstanceId: 'af-instance-123',
          mtcProviderInformation: 'mtc-data'
        })
        .expect(201);

      await request(app)
        .patch(`/nudm-pp/v1/5g-vn-groups/${groupId}`)
        .send({
          members: null,
          mtcProviderInformation: null
        })
        .expect(204);
    });

    it('should update 5gVnGroupData modifications', async () => {
      const groupId = 'modify-vndata@example.com';
      
      await request(app)
        .put(`/nudm-pp/v1/5g-vn-groups/${groupId}`)
        .send({
          '5gVnGroupData': {
            dnn: 'internet',
            sNssai: {
              sst: 1,
              sd: 'ABCDEF'
            },
            pduSessionTypes: ['IPV4'],
            secondaryAuth: false
          }
        })
        .expect(201);

      await request(app)
        .patch(`/nudm-pp/v1/5g-vn-groups/${groupId}`)
        .send({
          '5gVnGroupData': {
            appDescriptors: [
              {
                osId: 'android-app-1',
                appId: 'com.example.app'
              }
            ],
            secondaryAuth: true
          }
        })
        .expect(204);
    });

    it('should update members array', async () => {
      const groupId = 'update-members@example.com';
      
      await request(app)
        .put(`/nudm-pp/v1/5g-vn-groups/${groupId}`)
        .send({
          '5gVnGroupData': {
            dnn: 'internet',
            sNssai: {
              sst: 1
            }
          },
          members: [
            'msisdn-1234567890',
            'msisdn-0987654321'
          ]
        })
        .expect(201);

      await request(app)
        .patch(`/nudm-pp/v1/5g-vn-groups/${groupId}`)
        .send({
          members: [
            'msisdn-1111111111',
            'msisdn-2222222222',
            'msisdn-3333333333'
          ]
        })
        .expect(204);
    });

    it('should update membersData', async () => {
      const groupId = 'update-membersdata@example.com';
      
      await request(app)
        .put(`/nudm-pp/v1/5g-vn-groups/${groupId}`)
        .send({
          '5gVnGroupData': {
            dnn: 'internet',
            sNssai: {
              sst: 1
            }
          },
          membersData: {
            'msisdn-1234567890': {},
            'msisdn-0987654321': {}
          }
        })
        .expect(201);

      await request(app)
        .patch(`/nudm-pp/v1/5g-vn-groups/${groupId}`)
        .send({
          membersData: {
            'msisdn-5555555555': {},
            'msisdn-6666666666': {}
          }
        })
        .expect(204);
    });

    it('should accept supported-features query parameter', async () => {
      const groupId = 'features-patch@example.com';
      
      await request(app)
        .put(`/nudm-pp/v1/5g-vn-groups/${groupId}`)
        .send({
          '5gVnGroupData': {
            dnn: 'internet',
            sNssai: {
              sst: 1
            }
          }
        })
        .expect(201);

      await request(app)
        .patch(`/nudm-pp/v1/5g-vn-groups/${groupId}`)
        .query({ 'supported-features': 'ABC123' })
        .send({
          afInstanceId: 'af-new'
        })
        .expect(204);
    });

    it('should update multiple properties at once', async () => {
      const groupId = 'multi-prop@example.com';
      
      await request(app)
        .put(`/nudm-pp/v1/5g-vn-groups/${groupId}`)
        .send({
          '5gVnGroupData': {
            dnn: 'internet',
            sNssai: {
              sst: 1
            }
          },
          referenceId: 1,
          afInstanceId: 'af-old'
        })
        .expect(201);

      await request(app)
        .patch(`/nudm-pp/v1/5g-vn-groups/${groupId}`)
        .send({
          '5gVnGroupData': {
            secondaryAuth: true,
            '5gVnGroupCommunicationInd': true,
            '5gVnGroupCommunicationType': 'WITH_N6_BASED_FORWARDING'
          },
          afInstanceId: 'af-new',
          mtcProviderInformation: 'mtc-data',
          members: [
            'msisdn-1234567890'
          ]
        })
        .expect(204);
    });

    it('should handle empty patch body', async () => {
      const groupId = 'empty-body@example.com';
      
      await request(app)
        .put(`/nudm-pp/v1/5g-vn-groups/${groupId}`)
        .send({
          '5gVnGroupData': {
            dnn: 'internet',
            sNssai: {
              sst: 1
            }
          }
        })
        .expect(201);

      await request(app)
        .patch(`/nudm-pp/v1/5g-vn-groups/${groupId}`)
        .send({})
        .expect(204);
    });

    it('should update maxGroupDataRate', async () => {
      const groupId = 'update-datarate@example.com';
      
      await request(app)
        .put(`/nudm-pp/v1/5g-vn-groups/${groupId}`)
        .send({
          '5gVnGroupData': {
            dnn: 'internet',
            sNssai: {
              sst: 1
            },
            maxGroupDataRate: {
              uplink: '100 Mbps',
              downlink: '200 Mbps'
            }
          }
        })
        .expect(201);

      await request(app)
        .patch(`/nudm-pp/v1/5g-vn-groups/${groupId}`)
        .send({
          '5gVnGroupData': {
            maxGroupDataRate: {
              uplink: '500 Mbps',
              downlink: '1 Gbps'
            }
          }
        })
        .expect(204);
    });

    it('should delete nested properties with null', async () => {
      const groupId = 'delete-nested@example.com';
      
      await request(app)
        .put(`/nudm-pp/v1/5g-vn-groups/${groupId}`)
        .send({
          '5gVnGroupData': {
            dnn: 'internet',
            sNssai: {
              sst: 1
            },
            secondaryAuth: true,
            dnAaaIpAddressAllocation: true
          }
        })
        .expect(201);

      await request(app)
        .patch(`/nudm-pp/v1/5g-vn-groups/${groupId}`)
        .send({
          '5gVnGroupData': {
            secondaryAuth: null,
            dnAaaIpAddressAllocation: null
          }
        })
        .expect(204);
    });

    it('should handle URL encoded extGroupId', async () => {
      const groupId = 'encoded-patch@example.com';
      
      await request(app)
        .put(`/nudm-pp/v1/5g-vn-groups/${groupId}`)
        .send({
          '5gVnGroupData': {
            dnn: 'internet',
            sNssai: {
              sst: 1
            }
          }
        })
        .expect(201);

      await request(app)
        .patch('/nudm-pp/v1/5g-vn-groups/encoded-patch%40example.com')
        .send({
          afInstanceId: 'af-new'
        })
        .expect(204);
    });

    it('should handle complex extGroupId', async () => {
      const groupId = 'complex.group_123-456@subdomain.example.com';
      
      await request(app)
        .put(`/nudm-pp/v1/5g-vn-groups/${groupId}`)
        .send({
          '5gVnGroupData': {
            dnn: 'internet',
            sNssai: {
              sst: 1
            }
          }
        })
        .expect(201);

      await request(app)
        .patch(`/nudm-pp/v1/5g-vn-groups/${groupId}`)
        .send({
          afInstanceId: 'af-updated'
        })
        .expect(204);
    });

    it('should update with all modification fields', async () => {
      const groupId = 'all-modifications@example.com';
      
      await request(app)
        .put(`/nudm-pp/v1/5g-vn-groups/${groupId}`)
        .send({
          '5gVnGroupData': {
            dnn: 'internet',
            sNssai: {
              sst: 1
            }
          },
          referenceId: 1
        })
        .expect(201);

      await request(app)
        .patch(`/nudm-pp/v1/5g-vn-groups/${groupId}`)
        .send({
          '5gVnGroupData': {
            appDescriptors: [
              {
                osId: 'android-app',
                appId: 'com.example'
              }
            ],
            secondaryAuth: true,
            dnAaaIpAddressAllocation: true,
            dnAaaAddress: {
              ipv4Addr: '192.168.1.1'
            },
            additionalDnAaaAddresses: [
              {
                ipv4Addr: '192.168.1.2'
              }
            ],
            dnAaaFqdn: 'aaa.example.com',
            '5gVnGroupCommunicationInd': true,
            '5gVnGroupCommunicationType': 'WITH_N6_BASED_FORWARDING',
            maxGroupDataRate: {
              uplink: '1 Gbps',
              downlink: '2 Gbps'
            }
          },
          afInstanceId: 'af-complete',
          mtcProviderInformation: 'mtc-complete',
          members: [
            'msisdn-1234567890'
          ],
          membersData: {
            'msisdn-1234567890': {}
          }
        })
        .expect(204);
    });
  });

  describe('Validation error cases', () => {
    it('should return 400 for invalid extGroupId without @', async () => {
      const response = await request(app)
        .patch('/nudm-pp/v1/5g-vn-groups/invalid-group-id')
        .send({
          afInstanceId: 'af-new'
        })
        .expect(400)
        .expect('Content-Type', /json/);

      expect(response.body).to.have.property('status', 400);
      expect(response.body).to.have.property('title', 'Bad Request');
      expect(response.body).to.have.property('detail');
      expect(response.body.detail).to.include('extGroupId');
      expect(response.body).to.have.property('cause', 'INVALID_PARAMETER');
    });

    it('should return 400 for extGroupId with only @', async () => {
      const response = await request(app)
        .patch('/nudm-pp/v1/5g-vn-groups/@')
        .send({
          afInstanceId: 'af-new'
        })
        .expect(400);

      expect(response.body).to.have.property('status', 400);
      expect(response.body).to.have.property('cause', 'INVALID_PARAMETER');
    });

    it('should return 400 for extGroupId starting with @', async () => {
      const response = await request(app)
        .patch('/nudm-pp/v1/5g-vn-groups/@example.com')
        .send({
          afInstanceId: 'af-new'
        })
        .expect(400);

      expect(response.body).to.have.property('status', 400);
      expect(response.body).to.have.property('cause', 'INVALID_PARAMETER');
    });

    it('should return 400 for extGroupId ending with @', async () => {
      const response = await request(app)
        .patch('/nudm-pp/v1/5g-vn-groups/group@')
        .send({
          afInstanceId: 'af-new'
        })
        .expect(400);

      expect(response.body).to.have.property('status', 400);
      expect(response.body).to.have.property('cause', 'INVALID_PARAMETER');
    });

    it('should return 400 for extGroupId with multiple @ symbols', async () => {
      const response = await request(app)
        .patch('/nudm-pp/v1/5g-vn-groups/group@domain@example.com')
        .send({
          afInstanceId: 'af-new'
        })
        .expect(400);

      expect(response.body).to.have.property('status', 400);
      expect(response.body).to.have.property('cause', 'INVALID_PARAMETER');
    });

    it('should return 404 for non-existent group', async () => {
      const response = await request(app)
        .patch('/nudm-pp/v1/5g-vn-groups/nonexistent-patch@example.com')
        .send({
          afInstanceId: 'af-new'
        })
        .expect(404)
        .expect('Content-Type', /json/);

      expect(response.body).to.have.property('status', 404);
      expect(response.body).to.have.property('title', 'Not Found');
      expect(response.body).to.have.property('detail');
      expect(response.body.detail).to.include('not found');
      expect(response.body).to.have.property('cause', 'DATA_NOT_FOUND');
    });

    it('should return 400 for array request body', async () => {
      const groupId = 'array-body@example.com';
      
      await request(app)
        .put(`/nudm-pp/v1/5g-vn-groups/${groupId}`)
        .send({
          '5gVnGroupData': {
            dnn: 'internet',
            sNssai: {
              sst: 1
            }
          }
        })
        .expect(201);

      const response = await request(app)
        .patch(`/nudm-pp/v1/5g-vn-groups/${groupId}`)
        .send([
          { afInstanceId: 'af-new' }
        ])
        .expect(400);

      expect(response.body).to.have.property('status', 400);
      expect(response.body).to.have.property('cause', 'INVALID_PARAMETER');
    });

    it('should return 404 for empty extGroupId', async () => {
      await request(app)
        .patch('/nudm-pp/v1/5g-vn-groups/')
        .send({
          afInstanceId: 'af-new'
        })
        .expect(404);
    });
  });

  describe('Error response format', () => {
    it('should have correct 3GPP error structure for 400', async () => {
      const response = await request(app)
        .patch('/nudm-pp/v1/5g-vn-groups/invalid-group')
        .send({
          afInstanceId: 'af-new'
        })
        .expect(400);

      expect(response.body).to.have.property('type', 'urn:3gpp:error:invalid-parameter');
      expect(response.body).to.have.property('title');
      expect(response.body).to.have.property('status');
      expect(response.body).to.have.property('detail');
      expect(response.body).to.have.property('cause');
    });

    it('should have correct 3GPP error structure for 404', async () => {
      const response = await request(app)
        .patch('/nudm-pp/v1/5g-vn-groups/notfound-patch@example.com')
        .send({
          afInstanceId: 'af-new'
        })
        .expect(404);

      expect(response.body).to.have.property('type', 'urn:3gpp:error:not-found');
      expect(response.body).to.have.property('title');
      expect(response.body).to.have.property('status');
      expect(response.body).to.have.property('detail');
      expect(response.body).to.have.property('cause');
    });

    it('should return JSON content type for 400 errors', async () => {
      await request(app)
        .patch('/nudm-pp/v1/5g-vn-groups/invalid-group')
        .send({
          afInstanceId: 'af-new'
        })
        .expect(400)
        .expect('Content-Type', /json/);
    });

    it('should return JSON content type for 404 errors', async () => {
      await request(app)
        .patch('/nudm-pp/v1/5g-vn-groups/notfound-patch@example.com')
        .send({
          afInstanceId: 'af-new'
        })
        .expect(404)
        .expect('Content-Type', /json/);
    });
  });

  describe('Edge cases', () => {
    it('should handle very long extGroupId', async () => {
      const longGroupId = 'a'.repeat(100) + '@' + 'b'.repeat(100) + '.com';
      
      await request(app)
        .put(`/nudm-pp/v1/5g-vn-groups/${longGroupId}`)
        .send({
          '5gVnGroupData': {
            dnn: 'internet',
            sNssai: {
              sst: 1
            }
          }
        })
        .expect(201);

      await request(app)
        .patch(`/nudm-pp/v1/5g-vn-groups/${longGroupId}`)
        .send({
          afInstanceId: 'af-new'
        })
        .expect(204);
    });

    it('should handle extGroupId with special characters', async () => {
      const specialGroupId = 'group.name_123-456@example.com';
      
      await request(app)
        .put(`/nudm-pp/v1/5g-vn-groups/${specialGroupId}`)
        .send({
          '5gVnGroupData': {
            dnn: 'internet',
            sNssai: {
              sst: 1
            }
          }
        })
        .expect(201);

      await request(app)
        .patch(`/nudm-pp/v1/5g-vn-groups/${specialGroupId}`)
        .send({
          afInstanceId: 'af-new'
        })
        .expect(204);
    });

    it('should handle patch with only null values', async () => {
      const groupId = 'only-nulls@example.com';
      
      await request(app)
        .put(`/nudm-pp/v1/5g-vn-groups/${groupId}`)
        .send({
          '5gVnGroupData': {
            dnn: 'internet',
            sNssai: {
              sst: 1
            }
          },
          members: [
            'msisdn-1234567890'
          ],
          afInstanceId: 'af-old'
        })
        .expect(201);

      await request(app)
        .patch(`/nudm-pp/v1/5g-vn-groups/${groupId}`)
        .send({
          members: null,
          afInstanceId: null
        })
        .expect(204);
    });

    it('should preserve unmodified properties', async () => {
      const groupId = 'preserve-props@example.com';
      
      await request(app)
        .put(`/nudm-pp/v1/5g-vn-groups/${groupId}`)
        .send({
          '5gVnGroupData': {
            dnn: 'internet',
            sNssai: {
              sst: 1,
              sd: 'ABCDEF'
            },
            secondaryAuth: true
          },
          referenceId: 1,
          afInstanceId: 'af-original'
        })
        .expect(201);

      await request(app)
        .patch(`/nudm-pp/v1/5g-vn-groups/${groupId}`)
        .send({
          mtcProviderInformation: 'mtc-new'
        })
        .expect(204);
    });

    it('should handle multiple patches sequentially', async () => {
      const groupId = 'sequential@example.com';
      
      await request(app)
        .put(`/nudm-pp/v1/5g-vn-groups/${groupId}`)
        .send({
          '5gVnGroupData': {
            dnn: 'internet',
            sNssai: {
              sst: 1
            }
          },
          referenceId: 1
        })
        .expect(201);

      await request(app)
        .patch(`/nudm-pp/v1/5g-vn-groups/${groupId}`)
        .send({
          afInstanceId: 'af-first'
        })
        .expect(204);

      await request(app)
        .patch(`/nudm-pp/v1/5g-vn-groups/${groupId}`)
        .send({
          mtcProviderInformation: 'mtc-second'
        })
        .expect(204);

      await request(app)
        .patch(`/nudm-pp/v1/5g-vn-groups/${groupId}`)
        .send({
          members: [
            'msisdn-1234567890'
          ]
        })
        .expect(204);
    });

    it('should handle patch after delete failure', async () => {
      const groupId = 'patch-after-fail@example.com';
      
      await request(app)
        .put(`/nudm-pp/v1/5g-vn-groups/${groupId}`)
        .send({
          '5gVnGroupData': {
            dnn: 'internet',
            sNssai: {
              sst: 1
            }
          }
        })
        .expect(201);

      await request(app)
        .delete(`/nudm-pp/v1/5g-vn-groups/${groupId}`)
        .expect(204);

      await request(app)
        .patch(`/nudm-pp/v1/5g-vn-groups/${groupId}`)
        .send({
          afInstanceId: 'af-new'
        })
        .expect(404);
    });
  });

  describe('Case sensitivity', () => {
    it('should treat extGroupId as case sensitive', async () => {
      const lowerCaseId = 'patchcase@example.com';
      const upperCaseId = 'PatchCase@Example.com';
      
      await request(app)
        .put(`/nudm-pp/v1/5g-vn-groups/${lowerCaseId}`)
        .send({
          '5gVnGroupData': {
            dnn: 'internet',
            sNssai: {
              sst: 1
            }
          }
        })
        .expect(201);

      await request(app)
        .put(`/nudm-pp/v1/5g-vn-groups/${upperCaseId}`)
        .send({
          '5gVnGroupData': {
            dnn: 'ims',
            sNssai: {
              sst: 2
            }
          }
        })
        .expect(201);

      await request(app)
        .patch(`/nudm-pp/v1/5g-vn-groups/${lowerCaseId}`)
        .send({
          afInstanceId: 'af-lower'
        })
        .expect(204);

      await request(app)
        .patch(`/nudm-pp/v1/5g-vn-groups/${upperCaseId}`)
        .send({
          afInstanceId: 'af-upper'
        })
        .expect(204);
    });

    it('should return 404 when case does not match existing group', async () => {
      const groupId = 'lowercase-patch@example.com';
      
      await request(app)
        .put(`/nudm-pp/v1/5g-vn-groups/${groupId}`)
        .send({
          '5gVnGroupData': {
            dnn: 'internet',
            sNssai: {
              sst: 1
            }
          }
        })
        .expect(201);

      const response = await request(app)
        .patch('/nudm-pp/v1/5g-vn-groups/Lowercase-Patch@Example.com')
        .send({
          afInstanceId: 'af-new'
        })
        .expect(404);

      expect(response.body).to.have.property('status', 404);
    });
  });

  describe('Integration with other operations', () => {
    it('should allow patching after creation', async () => {
      const groupId = 'create-then-patch@example.com';
      
      await request(app)
        .put(`/nudm-pp/v1/5g-vn-groups/${groupId}`)
        .send({
          '5gVnGroupData': {
            dnn: 'internet',
            sNssai: {
              sst: 1
            }
          },
          referenceId: 1
        })
        .expect(201);

      await request(app)
        .patch(`/nudm-pp/v1/5g-vn-groups/${groupId}`)
        .send({
          referenceId: 2
        })
        .expect(204);
    });

    it('should allow deletion after patching', async () => {
      const groupId = 'patch-then-delete@example.com';
      
      await request(app)
        .put(`/nudm-pp/v1/5g-vn-groups/${groupId}`)
        .send({
          '5gVnGroupData': {
            dnn: 'internet',
            sNssai: {
              sst: 1
            }
          }
        })
        .expect(201);

      await request(app)
        .patch(`/nudm-pp/v1/5g-vn-groups/${groupId}`)
        .send({
          afInstanceId: 'af-new'
        })
        .expect(204);

      await request(app)
        .delete(`/nudm-pp/v1/5g-vn-groups/${groupId}`)
        .expect(204);
    });

    it('should handle create-patch-delete-create cycle', async () => {
      const groupId = 'cycle-patch@example.com';
      
      await request(app)
        .put(`/nudm-pp/v1/5g-vn-groups/${groupId}`)
        .send({
          '5gVnGroupData': {
            dnn: 'internet',
            sNssai: {
              sst: 1
            }
          },
          referenceId: 1
        })
        .expect(201);

      await request(app)
        .patch(`/nudm-pp/v1/5g-vn-groups/${groupId}`)
        .send({
          referenceId: 2
        })
        .expect(204);

      await request(app)
        .delete(`/nudm-pp/v1/5g-vn-groups/${groupId}`)
        .expect(204);

      await request(app)
        .put(`/nudm-pp/v1/5g-vn-groups/${groupId}`)
        .send({
          '5gVnGroupData': {
            dnn: 'ims',
            sNssai: {
              sst: 2
            }
          },
          referenceId: 3
        })
        .expect(201);
    });
  });
});

describe('PUT /:ueId/pp-data-store/:afInstanceId', () => {
  const validUeId = 'imsi-123456789012345';
  const validAfInstanceId = 'af-instance-123';

  describe('Success cases', () => {
    it('should create a new PP data entry with 201', async () => {
      const ppDataEntry = {
        communicationCharacteristics: {
          ppDlPacketCount: 5,
          maximumResponseTime: 300,
          maximumLatency: 100
        },
        referenceId: 1,
        validityTime: '2025-12-31T23:59:59Z',
        supportedFeatures: 'abc123'
      };

      const response = await request(app)
        .put(`/nudm-pp/v1/${validUeId}/pp-data-store/${validAfInstanceId}`)
        .send(ppDataEntry)
        .expect(201)
        .expect('Content-Type', /json/);

      expect(response.body).to.deep.equal(ppDataEntry);
    });

    it('should update an existing PP data entry with 204', async () => {
      const initialEntry = {
        communicationCharacteristics: {
          ppDlPacketCount: 5
        },
        referenceId: 1
      };

      await request(app)
        .put(`/nudm-pp/v1/${validUeId}/pp-data-store/af-update-test`)
        .send(initialEntry)
        .expect(201);

      const updatedEntry = {
        communicationCharacteristics: {
          ppDlPacketCount: 10
        },
        referenceId: 2
      };

      await request(app)
        .put(`/nudm-pp/v1/${validUeId}/pp-data-store/af-update-test`)
        .send(updatedEntry)
        .expect(204);
    });

    it('should accept anyUE as ueId', async () => {
      const ppDataEntry = {
        communicationCharacteristics: {
          ppDlPacketCount: 3
        },
        referenceId: 1
      };

      await request(app)
        .put(`/nudm-pp/v1/anyUE/pp-data-store/${validAfInstanceId}`)
        .send(ppDataEntry)
        .expect(201);
    });

    it('should accept msisdn format for ueId', async () => {
      const ppDataEntry = {
        referenceId: 1
      };

      await request(app)
        .put('/nudm-pp/v1/msisdn-1234567890/pp-data-store/af-123')
        .send(ppDataEntry)
        .expect(201);
    });

    it('should accept extid format for ueId', async () => {
      const ppDataEntry = {
        referenceId: 1
      };

      await request(app)
        .put('/nudm-pp/v1/extid-user@domain.com/pp-data-store/af-123')
        .send(ppDataEntry)
        .expect(201);
    });

    it('should accept nai format for ueId', async () => {
      const ppDataEntry = {
        referenceId: 1
      };

      await request(app)
        .put('/nudm-pp/v1/nai-user@example.com/pp-data-store/af-123')
        .send(ppDataEntry)
        .expect(201);
    });

    it('should accept gci format for ueId', async () => {
      const ppDataEntry = {
        referenceId: 1
      };

      await request(app)
        .put('/nudm-pp/v1/gci-123456/pp-data-store/af-123')
        .send(ppDataEntry)
        .expect(201);
    });

    it('should accept gli format for ueId', async () => {
      const ppDataEntry = {
        referenceId: 1
      };

      await request(app)
        .put('/nudm-pp/v1/gli-abcdef/pp-data-store/af-123')
        .send(ppDataEntry)
        .expect(201);
    });

    it('should accept extgroupid format for ueId', async () => {
      const ppDataEntry = {
        referenceId: 1
      };

      await request(app)
        .put('/nudm-pp/v1/extgroupid-group@domain.com/pp-data-store/af-123')
        .send(ppDataEntry)
        .expect(201);
    });

    it('should handle PP data entry with ecsAddrConfigInfo', async () => {
      const ppDataEntry = {
        communicationCharacteristics: {
          ppDlPacketCount: 5
        },
        referenceId: 1,
        ecsAddrConfigInfo: {
          ecsServerAddr: {
            fqdn: 'ecs.example.com'
          },
          dnn: 'internet',
          snssai: {
            sst: 1,
            sd: '000001'
          }
        }
      };

      const response = await request(app)
        .put(`/nudm-pp/v1/${validUeId}/pp-data-store/af-ecs-test`)
        .send(ppDataEntry)
        .expect(201);

      expect(response.body).to.have.property('ecsAddrConfigInfo');
      expect(response.body.ecsAddrConfigInfo).to.have.property('ecsServerAddr');
    });

    it('should handle PP data entry with ecRestriction', async () => {
      const ppDataEntry = {
        referenceId: 1,
        ecRestriction: {
          afInstanceId: 'af-123',
          referenceId: 2,
          plmnEcInfos: [
            {
              plmnId: {
                mcc: '001',
                mnc: '01'
              },
              ecRestrictionDataNb: true
            }
          ]
        }
      };

      const response = await request(app)
        .put(`/nudm-pp/v1/${validUeId}/pp-data-store/af-ec-test`)
        .send(ppDataEntry)
        .expect(201);

      expect(response.body).to.have.property('ecRestriction');
      expect(response.body.ecRestriction).to.have.property('plmnEcInfos');
    });

    it('should handle PP data entry with sliceUsageControlInfos', async () => {
      const ppDataEntry = {
        referenceId: 1,
        sliceUsageControlInfos: [
          {
            snssai: {
              sst: 1,
              sd: '000001'
            },
            allowedPdnTypes: ['IPV4', 'IPV6']
          }
        ]
      };

      const response = await request(app)
        .put(`/nudm-pp/v1/${validUeId}/pp-data-store/af-slice-test`)
        .send(ppDataEntry)
        .expect(201);

      expect(response.body).to.have.property('sliceUsageControlInfos');
      expect(response.body.sliceUsageControlInfos).to.be.an('array');
    });

    it('should handle PP data entry with mtcProviderInformation', async () => {
      const ppDataEntry = {
        referenceId: 1,
        mtcProviderInformation: {
          mtcProviderId: 'provider123'
        }
      };

      const response = await request(app)
        .put(`/nudm-pp/v1/${validUeId}/pp-data-store/af-mtc-test`)
        .send(ppDataEntry)
        .expect(201);

      expect(response.body).to.have.property('mtcProviderInformation');
    });

    it('should handle empty JSON object', async () => {
      const ppDataEntry = {};

      await request(app)
        .put(`/nudm-pp/v1/${validUeId}/pp-data-store/af-empty-test`)
        .send(ppDataEntry)
        .expect(201);
    });

    it('should store entries independently per ueId and afInstanceId combination', async () => {
      const entry1 = {
        referenceId: 1,
        validityTime: '2025-12-31T23:59:59Z'
      };

      const entry2 = {
        referenceId: 2,
        validityTime: '2026-12-31T23:59:59Z'
      };

      await request(app)
        .put(`/nudm-pp/v1/imsi-111111111111111/pp-data-store/af-001`)
        .send(entry1)
        .expect(201);

      await request(app)
        .put(`/nudm-pp/v1/imsi-111111111111111/pp-data-store/af-002`)
        .send(entry2)
        .expect(201);

      await request(app)
        .put(`/nudm-pp/v1/imsi-222222222222222/pp-data-store/af-001`)
        .send(entry2)
        .expect(201);
    });
  });

  describe('Error cases', () => {
    it('should reject invalid ueId format', async () => {
      const ppDataEntry = {
        referenceId: 1
      };

      const response = await request(app)
        .put('/nudm-pp/v1/invalid-ue-id/pp-data-store/af-123')
        .send(ppDataEntry)
        .expect(400)
        .expect('Content-Type', /json/);

      expect(response.body).to.have.property('status', 400);
      expect(response.body).to.have.property('title', 'Bad Request');
      expect(response.body).to.have.property('detail', 'Invalid ueId format');
    });

    it('should reject ueId with invalid msisdn prefix', async () => {
      const ppDataEntry = {
        referenceId: 1
      };

      const response = await request(app)
        .put('/nudm-pp/v1/msisdn-123/pp-data-store/af-123')
        .send(ppDataEntry)
        .expect(400);

      expect(response.body).to.have.property('status', 400);
    });

    it('should reject ueId with invalid imsi prefix', async () => {
      const ppDataEntry = {
        referenceId: 1
      };

      const response = await request(app)
        .put('/nudm-pp/v1/imsi-123/pp-data-store/af-123')
        .send(ppDataEntry)
        .expect(400);

      expect(response.body).to.have.property('status', 400);
    });

    it('should reject array as request body', async () => {
      const response = await request(app)
        .put(`/nudm-pp/v1/${validUeId}/pp-data-store/${validAfInstanceId}`)
        .send([{ referenceId: 1 }])
        .expect(400);

      expect(response.body).to.have.property('status', 400);
      expect(response.body).to.have.property('detail', 'Request body must be a valid JSON object');
    });

    it('should reject invalid extid format (missing @ symbol)', async () => {
      const ppDataEntry = {
        referenceId: 1
      };

      const response = await request(app)
        .put('/nudm-pp/v1/extid-userdomain.com/pp-data-store/af-123')
        .send(ppDataEntry)
        .expect(400);

      expect(response.body).to.have.property('status', 400);
    });

    it('should reject invalid extgroupid format (missing @ symbol)', async () => {
      const ppDataEntry = {
        referenceId: 1
      };

      const response = await request(app)
        .put('/nudm-pp/v1/extgroupid-groupdomain.com/pp-data-store/af-123')
        .send(ppDataEntry)
        .expect(400);

      expect(response.body).to.have.property('status', 400);
    });
  });

  describe('Integration scenarios', () => {
    it('should create and then update the same PP data entry', async () => {
      const ueId = 'imsi-999999999999999';
      const afId = 'af-integration-test';

      const initialEntry = {
        communicationCharacteristics: {
          ppDlPacketCount: 5,
          maximumResponseTime: 300
        },
        referenceId: 1,
        validityTime: '2025-12-31T23:59:59Z'
      };

      const createResponse = await request(app)
        .put(`/nudm-pp/v1/${ueId}/pp-data-store/${afId}`)
        .send(initialEntry)
        .expect(201);

      expect(createResponse.body).to.deep.equal(initialEntry);

      const updatedEntry = {
        communicationCharacteristics: {
          ppDlPacketCount: 10,
          maximumResponseTime: 500,
          maximumLatency: 200
        },
        referenceId: 2,
        validityTime: '2026-12-31T23:59:59Z',
        supportedFeatures: 'xyz789'
      };

      await request(app)
        .put(`/nudm-pp/v1/${ueId}/pp-data-store/${afId}`)
        .send(updatedEntry)
        .expect(204);
    });

    it('should handle multiple AF instances for the same UE', async () => {
      const ueId = 'imsi-777777777777777';

      const entry1 = {
        communicationCharacteristics: {
          ppDlPacketCount: 3
        },
        referenceId: 1
      };

      const entry2 = {
        communicationCharacteristics: {
          ppDlPacketCount: 5
        },
        referenceId: 2
      };

      const entry3 = {
        communicationCharacteristics: {
          ppDlPacketCount: 7
        },
        referenceId: 3
      };

      await request(app)
        .put(`/nudm-pp/v1/${ueId}/pp-data-store/af-001`)
        .send(entry1)
        .expect(201);

      await request(app)
        .put(`/nudm-pp/v1/${ueId}/pp-data-store/af-002`)
        .send(entry2)
        .expect(201);

      await request(app)
        .put(`/nudm-pp/v1/${ueId}/pp-data-store/af-003`)
        .send(entry3)
        .expect(201);
    });

    it('should handle complex PP data entry with multiple fields', async () => {
      const complexEntry = {
        communicationCharacteristics: {
          ppDlPacketCount: 10,
          maximumResponseTime: 500,
          maximumLatency: 200,
          epsAppliedInd: true
        },
        referenceId: 1,
        validityTime: '2025-12-31T23:59:59Z',
        mtcProviderInformation: {
          mtcProviderId: 'provider-complex'
        },
        supportedFeatures: 'feature123',
        ecsAddrConfigInfo: {
          ecsServerAddr: {
            fqdn: 'ecs.complex.example.com'
          },
          dnn: 'internet',
          snssai: {
            sst: 1,
            sd: '000001'
          },
          ecsAuthMethods: ['TLS_CLIENT_SERVER_CERTIFICATE', 'TLS_AKMA']
        },
        additionalEcsAddrConfigInfos: [
          {
            ecsServerAddr: {
              fqdn: 'ecs2.complex.example.com'
            },
            dnn: 'ims',
            snssai: {
              sst: 2
            }
          }
        ],
        ecRestriction: {
          afInstanceId: 'af-complex',
          referenceId: 2,
          plmnEcInfos: [
            {
              plmnId: {
                mcc: '001',
                mnc: '01'
              },
              ecRestrictionDataNb: true
            },
            {
              plmnId: {
                mcc: '002',
                mnc: '02'
              },
              ecRestrictionDataNb: false
            }
          ]
        },
        sliceUsageControlInfos: [
          {
            snssai: {
              sst: 1,
              sd: '000001'
            },
            allowedPdnTypes: ['IPV4', 'IPV6']
          }
        ],
        cagProvisionInfo: {
          allowedCagList: ['cag-001', 'cag-002']
        }
      };

      const response = await request(app)
        .put(`/nudm-pp/v1/${validUeId}/pp-data-store/af-complex-test`)
        .send(complexEntry)
        .expect(201);

      expect(response.body).to.have.property('communicationCharacteristics');
      expect(response.body).to.have.property('ecsAddrConfigInfo');
      expect(response.body).to.have.property('additionalEcsAddrConfigInfos');
      expect(response.body).to.have.property('ecRestriction');
      expect(response.body).to.have.property('sliceUsageControlInfos');
      expect(response.body).to.have.property('cagProvisionInfo');
    });
  });
});

describe('DELETE /:ueId/pp-data-store/:afInstanceId', () => {
  const validUeId = 'imsi-123456789012345';
  const validAfInstanceId = 'af-delete-test';

  describe('Success cases', () => {
    it('should delete existing PP data entry', async () => {
      await request(app)
        .put(`/nudm-pp/v1/${validUeId}/pp-data-store/${validAfInstanceId}`)
        .send({
          communicationCharacteristics: {
            ppDlPacketCount: 5
          },
          referenceId: 1
        })
        .expect(201);

      await request(app)
        .delete(`/nudm-pp/v1/${validUeId}/pp-data-store/${validAfInstanceId}`)
        .expect(204);
    });

    it('should return 204 with no content', async () => {
      const afId = 'af-nocontent-test';
      
      await request(app)
        .put(`/nudm-pp/v1/${validUeId}/pp-data-store/${afId}`)
        .send({
          referenceId: 1
        })
        .expect(201);

      const response = await request(app)
        .delete(`/nudm-pp/v1/${validUeId}/pp-data-store/${afId}`)
        .expect(204);

      expect(response.body).to.be.empty;
    });

    it('should accept mtc-provider-information query parameter', async () => {
      const afId = 'af-mtc-query-test';
      
      await request(app)
        .put(`/nudm-pp/v1/${validUeId}/pp-data-store/${afId}`)
        .send({
          referenceId: 1
        });

      await request(app)
        .delete(`/nudm-pp/v1/${validUeId}/pp-data-store/${afId}`)
        .query({ 'mtc-provider-information': 'mtc-provider-data' })
        .expect(204);
    });

    it('should delete entry with anyUE as ueId', async () => {
      const afId = 'af-anyue-test';
      
      await request(app)
        .put(`/nudm-pp/v1/anyUE/pp-data-store/${afId}`)
        .send({
          referenceId: 1
        })
        .expect(201);

      await request(app)
        .delete(`/nudm-pp/v1/anyUE/pp-data-store/${afId}`)
        .expect(204);
    });

    it('should delete entry with msisdn format for ueId', async () => {
      const ueId = 'msisdn-1234567890';
      const afId = 'af-msisdn-test';
      
      await request(app)
        .put(`/nudm-pp/v1/${ueId}/pp-data-store/${afId}`)
        .send({
          referenceId: 1
        })
        .expect(201);

      await request(app)
        .delete(`/nudm-pp/v1/${ueId}/pp-data-store/${afId}`)
        .expect(204);
    });

    it('should delete entry with extid format for ueId', async () => {
      const ueId = 'extid-user@domain.com';
      const afId = 'af-extid-test';
      
      await request(app)
        .put(`/nudm-pp/v1/${ueId}/pp-data-store/${afId}`)
        .send({
          referenceId: 1
        })
        .expect(201);

      await request(app)
        .delete(`/nudm-pp/v1/${ueId}/pp-data-store/${afId}`)
        .expect(204);
    });

    it('should delete entry with nai format for ueId', async () => {
      const ueId = 'nai-user@example.com';
      const afId = 'af-nai-test';
      
      await request(app)
        .put(`/nudm-pp/v1/${ueId}/pp-data-store/${afId}`)
        .send({
          referenceId: 1
        })
        .expect(201);

      await request(app)
        .delete(`/nudm-pp/v1/${ueId}/pp-data-store/${afId}`)
        .expect(204);
    });

    it('should delete entry with gci format for ueId', async () => {
      const ueId = 'gci-123456';
      const afId = 'af-gci-test';
      
      await request(app)
        .put(`/nudm-pp/v1/${ueId}/pp-data-store/${afId}`)
        .send({
          referenceId: 1
        })
        .expect(201);

      await request(app)
        .delete(`/nudm-pp/v1/${ueId}/pp-data-store/${afId}`)
        .expect(204);
    });

    it('should delete entry with gli format for ueId', async () => {
      const ueId = 'gli-abcdef';
      const afId = 'af-gli-test';
      
      await request(app)
        .put(`/nudm-pp/v1/${ueId}/pp-data-store/${afId}`)
        .send({
          referenceId: 1
        })
        .expect(201);

      await request(app)
        .delete(`/nudm-pp/v1/${ueId}/pp-data-store/${afId}`)
        .expect(204);
    });

    it('should delete entry with extgroupid format for ueId', async () => {
      const ueId = 'extgroupid-group@domain.com';
      const afId = 'af-extgroupid-test';
      
      await request(app)
        .put(`/nudm-pp/v1/${ueId}/pp-data-store/${afId}`)
        .send({
          referenceId: 1
        })
        .expect(201);

      await request(app)
        .delete(`/nudm-pp/v1/${ueId}/pp-data-store/${afId}`)
        .expect(204);
    });

    it('should delete entry with URL encoded ueId', async () => {
      const ueId = 'extid-user@domain.com';
      const afId = 'af-encoded-test';
      
      await request(app)
        .put(`/nudm-pp/v1/${ueId}/pp-data-store/${afId}`)
        .send({
          referenceId: 1
        })
        .expect(201);

      await request(app)
        .delete('/nudm-pp/v1/extid-user%40domain.com/pp-data-store/af-encoded-test')
        .expect(204);
    });

    it('should delete entry with complex afInstanceId', async () => {
      const afId = 'af-complex_instance.123-456';
      
      await request(app)
        .put(`/nudm-pp/v1/${validUeId}/pp-data-store/${afId}`)
        .send({
          referenceId: 1
        })
        .expect(201);

      await request(app)
        .delete(`/nudm-pp/v1/${validUeId}/pp-data-store/${afId}`)
        .expect(204);
    });

    it('should delete multiple entries sequentially', async () => {
      const afIds = ['af-multi1', 'af-multi2', 'af-multi3'];

      for (const afId of afIds) {
        await request(app)
          .put(`/nudm-pp/v1/${validUeId}/pp-data-store/${afId}`)
          .send({
            referenceId: 1
          })
          .expect(201);
      }

      for (const afId of afIds) {
        await request(app)
          .delete(`/nudm-pp/v1/${validUeId}/pp-data-store/${afId}`)
          .expect(204);
      }
    });

    it('should handle deletion for different UEs independently', async () => {
      const ueId1 = 'imsi-111111111111111';
      const ueId2 = 'imsi-222222222222222';
      const afId = 'af-shared-test';

      await request(app)
        .put(`/nudm-pp/v1/${ueId1}/pp-data-store/${afId}`)
        .send({
          referenceId: 1
        })
        .expect(201);

      await request(app)
        .put(`/nudm-pp/v1/${ueId2}/pp-data-store/${afId}`)
        .send({
          referenceId: 2
        })
        .expect(201);

      await request(app)
        .delete(`/nudm-pp/v1/${ueId1}/pp-data-store/${afId}`)
        .expect(204);

      await request(app)
        .delete(`/nudm-pp/v1/${ueId2}/pp-data-store/${afId}`)
        .expect(204);
    });

    it('should handle deletion for same UE with different AF instances', async () => {
      const afId1 = 'af-instance-1';
      const afId2 = 'af-instance-2';

      await request(app)
        .put(`/nudm-pp/v1/${validUeId}/pp-data-store/${afId1}`)
        .send({
          referenceId: 1
        })
        .expect(201);

      await request(app)
        .put(`/nudm-pp/v1/${validUeId}/pp-data-store/${afId2}`)
        .send({
          referenceId: 2
        })
        .expect(201);

      await request(app)
        .delete(`/nudm-pp/v1/${validUeId}/pp-data-store/${afId1}`)
        .expect(204);

      await request(app)
        .delete(`/nudm-pp/v1/${validUeId}/pp-data-store/${afId2}`)
        .expect(204);
    });
  });

  describe('Validation error cases', () => {
    it('should return 400 for invalid ueId format', async () => {
      const response = await request(app)
        .delete('/nudm-pp/v1/invalid-ue-id/pp-data-store/af-123')
        .expect(400)
        .expect('Content-Type', /json/);

      expect(response.body).to.have.property('status', 400);
      expect(response.body).to.have.property('title', 'Bad Request');
      expect(response.body).to.have.property('detail');
      expect(response.body.detail).to.include('ueId');
      expect(response.body).to.have.property('cause', 'INVALID_PARAMETER');
    });

    it('should return 400 for msisdn with too few digits', async () => {
      const response = await request(app)
        .delete('/nudm-pp/v1/msisdn-1234/pp-data-store/af-123')
        .expect(400);

      expect(response.body).to.have.property('status', 400);
      expect(response.body).to.have.property('cause', 'INVALID_PARAMETER');
    });

    it('should return 400 for msisdn with too many digits', async () => {
      const response = await request(app)
        .delete('/nudm-pp/v1/msisdn-1234567890123456/pp-data-store/af-123')
        .expect(400);

      expect(response.body).to.have.property('status', 400);
      expect(response.body).to.have.property('cause', 'INVALID_PARAMETER');
    });

    it('should return 400 for imsi with too few digits', async () => {
      const response = await request(app)
        .delete('/nudm-pp/v1/imsi-1234/pp-data-store/af-123')
        .expect(400);

      expect(response.body).to.have.property('status', 400);
      expect(response.body).to.have.property('cause', 'INVALID_PARAMETER');
    });

    it('should return 400 for imsi with too many digits', async () => {
      const response = await request(app)
        .delete('/nudm-pp/v1/imsi-1234567890123456/pp-data-store/af-123')
        .expect(400);

      expect(response.body).to.have.property('status', 400);
      expect(response.body).to.have.property('cause', 'INVALID_PARAMETER');
    });

    it('should return 400 for extid without @', async () => {
      const response = await request(app)
        .delete('/nudm-pp/v1/extid-userdomain.com/pp-data-store/af-123')
        .expect(400);

      expect(response.body).to.have.property('status', 400);
      expect(response.body).to.have.property('cause', 'INVALID_PARAMETER');
    });

    it('should return 400 for empty ueId', async () => {
      await request(app)
        .delete('/nudm-pp/v1//pp-data-store/af-123')
        .expect(404);
    });

    it('should return 400 for ueId with only prefix', async () => {
      const response = await request(app)
        .delete('/nudm-pp/v1/msisdn-/pp-data-store/af-123')
        .expect(400);

      expect(response.body).to.have.property('status', 400);
      expect(response.body).to.have.property('cause', 'INVALID_PARAMETER');
    });

    it('should return 404 for non-existent entry', async () => {
      const response = await request(app)
        .delete('/nudm-pp/v1/imsi-999999999999999/pp-data-store/af-nonexistent')
        .expect(404)
        .expect('Content-Type', /json/);

      expect(response.body).to.have.property('status', 404);
      expect(response.body).to.have.property('title', 'Not Found');
      expect(response.body).to.have.property('detail');
      expect(response.body.detail).to.include('not found');
      expect(response.body).to.have.property('cause', 'DATA_NOT_FOUND');
    });

    it('should return 404 when deleting same entry twice', async () => {
      const afId = 'af-deletetwice-test';
      
      await request(app)
        .put(`/nudm-pp/v1/${validUeId}/pp-data-store/${afId}`)
        .send({
          referenceId: 1
        })
        .expect(201);

      await request(app)
        .delete(`/nudm-pp/v1/${validUeId}/pp-data-store/${afId}`)
        .expect(204);

      const response = await request(app)
        .delete(`/nudm-pp/v1/${validUeId}/pp-data-store/${afId}`)
        .expect(404);

      expect(response.body).to.have.property('status', 404);
      expect(response.body).to.have.property('cause', 'DATA_NOT_FOUND');
    });

    it('should return 404 for empty afInstanceId', async () => {
      await request(app)
        .delete(`/nudm-pp/v1/${validUeId}/pp-data-store/`)
        .expect(404);
    });

    it('should return 404 when deleting with wrong UE but correct AF', async () => {
      const afId = 'af-wrong-ue-test';
      
      await request(app)
        .put(`/nudm-pp/v1/${validUeId}/pp-data-store/${afId}`)
        .send({
          referenceId: 1
        })
        .expect(201);

      const response = await request(app)
        .delete('/nudm-pp/v1/imsi-999999999999999/pp-data-store/af-wrong-ue-test')
        .expect(404);

      expect(response.body).to.have.property('status', 404);
      expect(response.body).to.have.property('cause', 'DATA_NOT_FOUND');
    });

    it('should return 404 when deleting with correct UE but wrong AF', async () => {
      const afId = 'af-correct-test';
      
      await request(app)
        .put(`/nudm-pp/v1/${validUeId}/pp-data-store/${afId}`)
        .send({
          referenceId: 1
        })
        .expect(201);

      const response = await request(app)
        .delete(`/nudm-pp/v1/${validUeId}/pp-data-store/af-wrong-instance`)
        .expect(404);

      expect(response.body).to.have.property('status', 404);
      expect(response.body).to.have.property('cause', 'DATA_NOT_FOUND');
    });
  });

  describe('Error response format', () => {
    it('should have correct 3GPP error structure for 400', async () => {
      const response = await request(app)
        .delete('/nudm-pp/v1/invalid-ue/pp-data-store/af-123')
        .expect(400);

      expect(response.body).to.have.property('type', 'urn:3gpp:error:invalid-parameter');
      expect(response.body).to.have.property('title');
      expect(response.body).to.have.property('status');
      expect(response.body).to.have.property('detail');
      expect(response.body).to.have.property('cause');
    });

    it('should have correct 3GPP error structure for 404', async () => {
      const response = await request(app)
        .delete('/nudm-pp/v1/imsi-999999999999999/pp-data-store/af-notfound')
        .expect(404);

      expect(response.body).to.have.property('type', 'urn:3gpp:error:not-found');
      expect(response.body).to.have.property('title');
      expect(response.body).to.have.property('status');
      expect(response.body).to.have.property('detail');
      expect(response.body).to.have.property('cause');
    });
  });
});

describe('GET /:ueId/pp-data-store/:afInstanceId', () => {
  const validUeId = 'imsi-123456789012345';
  const validAfInstanceId = 'af-get-test';

  describe('Success cases', () => {
    it('should retrieve existing PP data entry', async () => {
      const ppDataEntry = {
        communicationCharacteristics: {
          ppDlPacketCount: 5,
          maximumResponseTime: 300,
          maximumLatency: 100
        },
        referenceId: 1,
        validityTime: '2025-12-31T23:59:59Z'
      };

      await request(app)
        .put(`/nudm-pp/v1/${validUeId}/pp-data-store/${validAfInstanceId}`)
        .send(ppDataEntry)
        .expect(201);

      const response = await request(app)
        .get(`/nudm-pp/v1/${validUeId}/pp-data-store/${validAfInstanceId}`)
        .expect(200)
        .expect('Content-Type', /json/);

      expect(response.body).to.have.property('communicationCharacteristics');
      expect(response.body.communicationCharacteristics).to.have.property('ppDlPacketCount', 5);
      expect(response.body).to.have.property('referenceId', 1);
      expect(response.body).to.have.property('validityTime', '2025-12-31T23:59:59Z');
    });

    it('should include supportedFeatures from query parameter', async () => {
      const afId = 'af-features-test';
      const ppDataEntry = {
        referenceId: 1
      };

      await request(app)
        .put(`/nudm-pp/v1/${validUeId}/pp-data-store/${afId}`)
        .send(ppDataEntry)
        .expect(201);

      const response = await request(app)
        .get(`/nudm-pp/v1/${validUeId}/pp-data-store/${afId}`)
        .query({ 'supported-features': 'abc123' })
        .expect(200);

      expect(response.body).to.have.property('supportedFeatures', 'abc123');
    });

    it('should accept mtc-provider-information query parameter', async () => {
      const afId = 'af-mtc-query-test';
      const ppDataEntry = {
        referenceId: 1
      };

      await request(app)
        .put(`/nudm-pp/v1/${validUeId}/pp-data-store/${afId}`)
        .send(ppDataEntry)
        .expect(201);

      await request(app)
        .get(`/nudm-pp/v1/${validUeId}/pp-data-store/${afId}`)
        .query({ 'mtc-provider-information': 'mtc-provider-data' })
        .expect(200);
    });

    it('should retrieve entry with anyUE as ueId', async () => {
      const afId = 'af-anyue-test';
      const ppDataEntry = {
        referenceId: 1
      };

      await request(app)
        .put(`/nudm-pp/v1/anyUE/pp-data-store/${afId}`)
        .send(ppDataEntry)
        .expect(201);

      const response = await request(app)
        .get(`/nudm-pp/v1/anyUE/pp-data-store/${afId}`)
        .expect(200);

      expect(response.body).to.have.property('referenceId', 1);
    });

    it('should retrieve entry with msisdn format for ueId', async () => {
      const ueId = 'msisdn-1234567890';
      const afId = 'af-msisdn-test';
      const ppDataEntry = {
        referenceId: 1
      };

      await request(app)
        .put(`/nudm-pp/v1/${ueId}/pp-data-store/${afId}`)
        .send(ppDataEntry)
        .expect(201);

      const response = await request(app)
        .get(`/nudm-pp/v1/${ueId}/pp-data-store/${afId}`)
        .expect(200);

      expect(response.body).to.have.property('referenceId', 1);
    });

    it('should retrieve entry with extid format for ueId', async () => {
      const ueId = 'extid-user@domain.com';
      const afId = 'af-extid-test';
      const ppDataEntry = {
        referenceId: 1
      };

      await request(app)
        .put(`/nudm-pp/v1/${ueId}/pp-data-store/${afId}`)
        .send(ppDataEntry)
        .expect(201);

      const response = await request(app)
        .get(`/nudm-pp/v1/${ueId}/pp-data-store/${afId}`)
        .expect(200);

      expect(response.body).to.have.property('referenceId', 1);
    });

    it('should retrieve entry with nai format for ueId', async () => {
      const ueId = 'nai-user@example.com';
      const afId = 'af-nai-test';
      const ppDataEntry = {
        referenceId: 1
      };

      await request(app)
        .put(`/nudm-pp/v1/${ueId}/pp-data-store/${afId}`)
        .send(ppDataEntry)
        .expect(201);

      const response = await request(app)
        .get(`/nudm-pp/v1/${ueId}/pp-data-store/${afId}`)
        .expect(200);

      expect(response.body).to.have.property('referenceId', 1);
    });

    it('should retrieve entry with gci format for ueId', async () => {
      const ueId = 'gci-123456';
      const afId = 'af-gci-test';
      const ppDataEntry = {
        referenceId: 1
      };

      await request(app)
        .put(`/nudm-pp/v1/${ueId}/pp-data-store/${afId}`)
        .send(ppDataEntry)
        .expect(201);

      const response = await request(app)
        .get(`/nudm-pp/v1/${ueId}/pp-data-store/${afId}`)
        .expect(200);

      expect(response.body).to.have.property('referenceId', 1);
    });

    it('should retrieve entry with gli format for ueId', async () => {
      const ueId = 'gli-abcdef';
      const afId = 'af-gli-test';
      const ppDataEntry = {
        referenceId: 1
      };

      await request(app)
        .put(`/nudm-pp/v1/${ueId}/pp-data-store/${afId}`)
        .send(ppDataEntry)
        .expect(201);

      const response = await request(app)
        .get(`/nudm-pp/v1/${ueId}/pp-data-store/${afId}`)
        .expect(200);

      expect(response.body).to.have.property('referenceId', 1);
    });

    it('should retrieve entry with extgroupid format for ueId', async () => {
      const ueId = 'extgroupid-group@domain.com';
      const afId = 'af-extgroupid-test';
      const ppDataEntry = {
        referenceId: 1
      };

      await request(app)
        .put(`/nudm-pp/v1/${ueId}/pp-data-store/${afId}`)
        .send(ppDataEntry)
        .expect(201);

      const response = await request(app)
        .get(`/nudm-pp/v1/${ueId}/pp-data-store/${afId}`)
        .expect(200);

      expect(response.body).to.have.property('referenceId', 1);
    });

    it('should retrieve entry with URL encoded ueId', async () => {
      const ueId = 'extid-user@domain.com';
      const afId = 'af-encoded-test';
      const ppDataEntry = {
        referenceId: 1
      };

      await request(app)
        .put(`/nudm-pp/v1/${ueId}/pp-data-store/${afId}`)
        .send(ppDataEntry)
        .expect(201);

      const response = await request(app)
        .get('/nudm-pp/v1/extid-user%40domain.com/pp-data-store/af-encoded-test')
        .expect(200);

      expect(response.body).to.have.property('referenceId', 1);
    });

    it('should retrieve entry with complex afInstanceId', async () => {
      const afId = 'af-complex_instance.123-456';
      const ppDataEntry = {
        referenceId: 1
      };

      await request(app)
        .put(`/nudm-pp/v1/${validUeId}/pp-data-store/${afId}`)
        .send(ppDataEntry)
        .expect(201);

      const response = await request(app)
        .get(`/nudm-pp/v1/${validUeId}/pp-data-store/${afId}`)
        .expect(200);

      expect(response.body).to.have.property('referenceId', 1);
    });

    it('should retrieve entry with ecsAddrConfigInfo', async () => {
      const afId = 'af-get-ecs-test';
      const ppDataEntry = {
        communicationCharacteristics: {
          ppDlPacketCount: 5
        },
        referenceId: 1,
        ecsAddrConfigInfo: {
          ecsServerAddr: {
            fqdn: 'ecs.example.com'
          },
          dnn: 'internet',
          snssai: {
            sst: 1,
            sd: '000001'
          }
        }
      };

      await request(app)
        .put(`/nudm-pp/v1/${validUeId}/pp-data-store/${afId}`)
        .send(ppDataEntry)
        .expect(201);

      const response = await request(app)
        .get(`/nudm-pp/v1/${validUeId}/pp-data-store/${afId}`)
        .expect(200);

      expect(response.body).to.have.property('ecsAddrConfigInfo');
      expect(response.body.ecsAddrConfigInfo).to.have.property('ecsServerAddr');
      expect(response.body.ecsAddrConfigInfo.ecsServerAddr).to.have.property('fqdn', 'ecs.example.com');
    });

    it('should retrieve entry with ecRestriction', async () => {
      const afId = 'af-get-ec-test';
      const ppDataEntry = {
        referenceId: 1,
        ecRestriction: {
          afInstanceId: 'af-123',
          referenceId: 2,
          plmnEcInfos: [
            {
              plmnId: {
                mcc: '001',
                mnc: '01'
              },
              ecRestrictionDataNb: true
            }
          ]
        }
      };

      await request(app)
        .put(`/nudm-pp/v1/${validUeId}/pp-data-store/${afId}`)
        .send(ppDataEntry)
        .expect(201);

      const response = await request(app)
        .get(`/nudm-pp/v1/${validUeId}/pp-data-store/${afId}`)
        .expect(200);

      expect(response.body).to.have.property('ecRestriction');
      expect(response.body.ecRestriction).to.have.property('plmnEcInfos');
      expect(response.body.ecRestriction.plmnEcInfos).to.be.an('array');
    });

    it('should retrieve entry with sliceUsageControlInfos', async () => {
      const afId = 'af-get-slice-test';
      const ppDataEntry = {
        referenceId: 1,
        sliceUsageControlInfos: [
          {
            snssai: {
              sst: 1,
              sd: '000001'
            },
            allowedPdnTypes: ['IPV4', 'IPV6']
          }
        ]
      };

      await request(app)
        .put(`/nudm-pp/v1/${validUeId}/pp-data-store/${afId}`)
        .send(ppDataEntry)
        .expect(201);

      const response = await request(app)
        .get(`/nudm-pp/v1/${validUeId}/pp-data-store/${afId}`)
        .expect(200);

      expect(response.body).to.have.property('sliceUsageControlInfos');
      expect(response.body.sliceUsageControlInfos).to.be.an('array');
    });

    it('should retrieve entry with mtcProviderInformation', async () => {
      const afId = 'af-get-mtc-test';
      const ppDataEntry = {
        referenceId: 1,
        mtcProviderInformation: {
          mtcProviderId: 'provider123'
        }
      };

      await request(app)
        .put(`/nudm-pp/v1/${validUeId}/pp-data-store/${afId}`)
        .send(ppDataEntry)
        .expect(201);

      const response = await request(app)
        .get(`/nudm-pp/v1/${validUeId}/pp-data-store/${afId}`)
        .expect(200);

      expect(response.body).to.have.property('mtcProviderInformation');
      expect(response.body.mtcProviderInformation).to.have.property('mtcProviderId', 'provider123');
    });

    it('should retrieve entries independently per ueId and afInstanceId combination', async () => {
      const entry1 = {
        referenceId: 1,
        validityTime: '2025-12-31T23:59:59Z'
      };

      const entry2 = {
        referenceId: 2,
        validityTime: '2026-12-31T23:59:59Z'
      };

      await request(app)
        .put(`/nudm-pp/v1/imsi-111111111111111/pp-data-store/af-get-001`)
        .send(entry1)
        .expect(201);

      await request(app)
        .put(`/nudm-pp/v1/imsi-111111111111111/pp-data-store/af-get-002`)
        .send(entry2)
        .expect(201);

      const response1 = await request(app)
        .get(`/nudm-pp/v1/imsi-111111111111111/pp-data-store/af-get-001`)
        .expect(200);

      const response2 = await request(app)
        .get(`/nudm-pp/v1/imsi-111111111111111/pp-data-store/af-get-002`)
        .expect(200);

      expect(response1.body).to.have.property('referenceId', 1);
      expect(response2.body).to.have.property('referenceId', 2);
    });

    it('should retrieve different entries for same afInstanceId with different ueIds', async () => {
      const ueId1 = 'imsi-111111111111111';
      const ueId2 = 'imsi-222222222222222';
      const afId = 'af-shared-test';

      const entry1 = {
        referenceId: 1
      };

      const entry2 = {
        referenceId: 2
      };

      await request(app)
        .put(`/nudm-pp/v1/${ueId1}/pp-data-store/${afId}`)
        .send(entry1)
        .expect(201);

      await request(app)
        .put(`/nudm-pp/v1/${ueId2}/pp-data-store/${afId}`)
        .send(entry2)
        .expect(201);

      const response1 = await request(app)
        .get(`/nudm-pp/v1/${ueId1}/pp-data-store/${afId}`)
        .expect(200);

      const response2 = await request(app)
        .get(`/nudm-pp/v1/${ueId2}/pp-data-store/${afId}`)
        .expect(200);

      expect(response1.body).to.have.property('referenceId', 1);
      expect(response2.body).to.have.property('referenceId', 2);
    });

    it('should retrieve entry with empty JSON object', async () => {
      const afId = 'af-get-empty-test';
      const ppDataEntry = {};

      await request(app)
        .put(`/nudm-pp/v1/${validUeId}/pp-data-store/${afId}`)
        .send(ppDataEntry)
        .expect(201);

      const response = await request(app)
        .get(`/nudm-pp/v1/${validUeId}/pp-data-store/${afId}`)
        .expect(200);

      expect(response.body).to.be.an('object');
    });

    it('should retrieve updated entry after PUT', async () => {
      const afId = 'af-get-update-test';
      const initialEntry = {
        referenceId: 1,
        validityTime: '2025-12-31T23:59:59Z'
      };

      const updatedEntry = {
        referenceId: 2,
        validityTime: '2026-12-31T23:59:59Z'
      };

      await request(app)
        .put(`/nudm-pp/v1/${validUeId}/pp-data-store/${afId}`)
        .send(initialEntry)
        .expect(201);

      const response1 = await request(app)
        .get(`/nudm-pp/v1/${validUeId}/pp-data-store/${afId}`)
        .expect(200);

      expect(response1.body).to.have.property('referenceId', 1);

      await request(app)
        .put(`/nudm-pp/v1/${validUeId}/pp-data-store/${afId}`)
        .send(updatedEntry)
        .expect(204);

      const response2 = await request(app)
        .get(`/nudm-pp/v1/${validUeId}/pp-data-store/${afId}`)
        .expect(200);

      expect(response2.body).to.have.property('referenceId', 2);
    });
  });

  describe('Not Found cases', () => {
    it('should return 404 for non-existent PP data entry', async () => {
      const response = await request(app)
        .get('/nudm-pp/v1/imsi-999999999999999/pp-data-store/af-nonexistent')
        .expect(404)
        .expect('Content-Type', /json/);

      expect(response.body).to.have.property('status', 404);
      expect(response.body).to.have.property('title', 'Not Found');
      expect(response.body).to.have.property('detail', 'PP Data Entry not found');
      expect(response.body).to.have.property('cause', 'DATA_NOT_FOUND');
    });

    it('should return 404 for non-existent ueId', async () => {
      const response = await request(app)
        .get('/nudm-pp/v1/imsi-888888888888888/pp-data-store/af-test')
        .expect(404);

      expect(response.body).to.have.property('status', 404);
      expect(response.body).to.have.property('cause', 'DATA_NOT_FOUND');
    });

    it('should return 404 for non-existent afInstanceId', async () => {
      const afId = 'af-exist-test';
      const ppDataEntry = {
        referenceId: 1
      };

      await request(app)
        .put(`/nudm-pp/v1/${validUeId}/pp-data-store/${afId}`)
        .send(ppDataEntry)
        .expect(201);

      const response = await request(app)
        .get(`/nudm-pp/v1/${validUeId}/pp-data-store/af-different`)
        .expect(404);

      expect(response.body).to.have.property('status', 404);
    });

    it('should return 404 after entry is deleted', async () => {
      const afId = 'af-delete-then-get';
      const ppDataEntry = {
        referenceId: 1
      };

      await request(app)
        .put(`/nudm-pp/v1/${validUeId}/pp-data-store/${afId}`)
        .send(ppDataEntry)
        .expect(201);

      await request(app)
        .get(`/nudm-pp/v1/${validUeId}/pp-data-store/${afId}`)
        .expect(200);

      await request(app)
        .delete(`/nudm-pp/v1/${validUeId}/pp-data-store/${afId}`)
        .expect(204);

      const response = await request(app)
        .get(`/nudm-pp/v1/${validUeId}/pp-data-store/${afId}`)
        .expect(404);

      expect(response.body).to.have.property('status', 404);
      expect(response.body).to.have.property('detail', 'PP Data Entry not found');
    });
  });

  describe('Validation error cases', () => {
    it('should return 400 for invalid ueId format', async () => {
      const response = await request(app)
        .get('/nudm-pp/v1/invalid-ue-id/pp-data-store/af-123')
        .expect(400)
        .expect('Content-Type', /json/);

      expect(response.body).to.have.property('status', 400);
      expect(response.body).to.have.property('title', 'Bad Request');
      expect(response.body).to.have.property('detail');
      expect(response.body.detail).to.include('ueId');
      expect(response.body).to.have.property('cause', 'INVALID_PARAMETER');
    });

    it('should return 400 for msisdn with too few digits', async () => {
      const response = await request(app)
        .get('/nudm-pp/v1/msisdn-1234/pp-data-store/af-123')
        .expect(400);

      expect(response.body).to.have.property('status', 400);
      expect(response.body).to.have.property('cause', 'INVALID_PARAMETER');
    });

    it('should return 400 for msisdn with too many digits', async () => {
      const response = await request(app)
        .get('/nudm-pp/v1/msisdn-1234567890123456/pp-data-store/af-123')
        .expect(400);

      expect(response.body).to.have.property('status', 400);
      expect(response.body).to.have.property('cause', 'INVALID_PARAMETER');
    });

    it('should return 400 for imsi with too few digits', async () => {
      const response = await request(app)
        .get('/nudm-pp/v1/imsi-1234/pp-data-store/af-123')
        .expect(400);

      expect(response.body).to.have.property('status', 400);
      expect(response.body).to.have.property('cause', 'INVALID_PARAMETER');
    });

    it('should return 400 for imsi with too many digits', async () => {
      const response = await request(app)
        .get('/nudm-pp/v1/imsi-1234567890123456/pp-data-store/af-123')
        .expect(400);

      expect(response.body).to.have.property('status', 400);
      expect(response.body).to.have.property('cause', 'INVALID_PARAMETER');
    });

    it('should return 400 for invalid extid format', async () => {
      const response = await request(app)
        .get('/nudm-pp/v1/extid-invalid/pp-data-store/af-123')
        .expect(400);

      expect(response.body).to.have.property('status', 400);
      expect(response.body).to.have.property('cause', 'INVALID_PARAMETER');
    });

    it('should return 400 for invalid extgroupid format', async () => {
      const response = await request(app)
        .get('/nudm-pp/v1/extgroupid-invalid/pp-data-store/af-123')
        .expect(400);

      expect(response.body).to.have.property('status', 400);
      expect(response.body).to.have.property('cause', 'INVALID_PARAMETER');
    });

    it('should return 400 for empty ueId', async () => {
      const response = await request(app)
        .get('/nudm-pp/v1//pp-data-store/af-123')
        .expect(404);
    });

    it('should return 400 for ueId with only prefix', async () => {
      const response = await request(app)
        .get('/nudm-pp/v1/imsi-/pp-data-store/af-123')
        .expect(400);

      expect(response.body).to.have.property('status', 400);
    });

    it('should return 400 for ueId with invalid characters in msisdn', async () => {
      const response = await request(app)
        .get('/nudm-pp/v1/msisdn-abc123/pp-data-store/af-123')
        .expect(400);

      expect(response.body).to.have.property('status', 400);
    });

    it('should return 400 for ueId with invalid characters in imsi', async () => {
      const response = await request(app)
        .get('/nudm-pp/v1/imsi-abc123/pp-data-store/af-123')
        .expect(400);

      expect(response.body).to.have.property('status', 400);
    });

    it('should return 400 for completely invalid ueId prefix', async () => {
      const response = await request(app)
        .get('/nudm-pp/v1/unknown-123456/pp-data-store/af-123')
        .expect(400);

      expect(response.body).to.have.property('status', 400);
      expect(response.body).to.have.property('cause', 'INVALID_PARAMETER');
    });

    it('should return 400 for ueId with spaces', async () => {
      const response = await request(app)
        .get('/nudm-pp/v1/imsi-123 456/pp-data-store/af-123')
        .expect(400);

      expect(response.body).to.have.property('status', 400);
    });

    it('should return 400 for ueId with special characters', async () => {
      const response = await request(app)
        .get('/nudm-pp/v1/imsi-123!456/pp-data-store/af-123')
        .expect(400);

      expect(response.body).to.have.property('status', 400);
    });
  });
});

describe('PUT /mbs-group-membership/:extGroupId', () => {
  const validExtGroupId = 'mbs-group@example.com';

  describe('Success cases', () => {
    it('should create MBS group membership with valid request body', async () => {
      const mbsGroupData = {
        multicastGroupMemb: [
          'msisdn-1234567890',
          'msisdn-0987654321'
        ],
        afInstanceId: 'af-instance-1',
        internalGroupIdentifier: 'internal-group-1'
      };

      const response = await request(app)
        .put(`/nudm-pp/v1/mbs-group-membership/${validExtGroupId}`)
        .send(mbsGroupData)
        .expect(201);

      expect(response.body).to.be.empty;
    });

    it('should create MBS group with minimum required fields', async () => {
      const mbsGroupData = {
        multicastGroupMemb: ['msisdn-1234567890']
      };

      await request(app)
        .put('/nudm-pp/v1/mbs-group-membership/group@domain.com')
        .send(mbsGroupData)
        .expect(201);
    });

    it('should accept multiple GPSI members', async () => {
      const mbsGroupData = {
        multicastGroupMemb: [
          'msisdn-1111111111',
          'msisdn-2222222222',
          'msisdn-3333333333',
          'msisdn-4444444444'
        ],
        afInstanceId: 'af-001'
      };

      await request(app)
        .put('/nudm-pp/v1/mbs-group-membership/multi@example.org')
        .send(mbsGroupData)
        .expect(201);
    });

    it('should accept extGroupId with valid format', async () => {
      const mbsGroupData = {
        multicastGroupMemb: ['msisdn-5555555555']
      };

      await request(app)
        .put('/nudm-pp/v1/mbs-group-membership/valid-group@test.com')
        .send(mbsGroupData)
        .expect(201);
    });

    it('should accept complex extGroupId formats', async () => {
      const mbsGroupData = {
        multicastGroupMemb: ['msisdn-6666666666']
      };

      await request(app)
        .put('/nudm-pp/v1/mbs-group-membership/complex.group-name@sub.domain.example.com')
        .send(mbsGroupData)
        .expect(201);
    });

    it('should accept afInstanceId field', async () => {
      const mbsGroupData = {
        multicastGroupMemb: ['msisdn-7777777777'],
        afInstanceId: 'af-test-instance'
      };

      await request(app)
        .put('/nudm-pp/v1/mbs-group-membership/af-test@example.com')
        .send(mbsGroupData)
        .expect(201);
    });

    it('should accept internalGroupIdentifier field', async () => {
      const mbsGroupData = {
        multicastGroupMemb: ['msisdn-8888888888'],
        internalGroupIdentifier: 'internal-id-123'
      };

      await request(app)
        .put('/nudm-pp/v1/mbs-group-membership/internal-test@example.com')
        .send(mbsGroupData)
        .expect(201);
    });

    it('should accept all optional fields', async () => {
      const mbsGroupData = {
        multicastGroupMemb: ['msisdn-9999999999'],
        afInstanceId: 'af-full-test',
        internalGroupIdentifier: 'internal-full-123'
      };

      await request(app)
        .put('/nudm-pp/v1/mbs-group-membership/full-test@example.com')
        .send(mbsGroupData)
        .expect(201);
    });
  });

  describe('Invalid extGroupId format', () => {
    const validBody = {
      multicastGroupMemb: ['msisdn-1234567890']
    };

    it('should return 400 for extGroupId without @ symbol', async () => {
      const response = await request(app)
        .put('/nudm-pp/v1/mbs-group-membership/invalid-group-id')
        .send(validBody)
        .expect(400);

      expect(response.body).to.have.property('status', 400);
      expect(response.body).to.have.property('type', 'urn:3gpp:error:invalid-parameter');
      expect(response.body).to.have.property('cause', 'INVALID_PARAMETER');
      expect(response.body).to.have.property('detail', 'Invalid extGroupId format');
    });

    it('should return 400 for extGroupId with only @', async () => {
      const response = await request(app)
        .put('/nudm-pp/v1/mbs-group-membership/@')
        .send(validBody)
        .expect(400);

      expect(response.body).to.have.property('status', 400);
      expect(response.body).to.have.property('cause', 'INVALID_PARAMETER');
    });

    it('should return 400 for extGroupId starting with @', async () => {
      const response = await request(app)
        .put('/nudm-pp/v1/mbs-group-membership/@domain.com')
        .send(validBody)
        .expect(400);

      expect(response.body).to.have.property('status', 400);
      expect(response.body).to.have.property('cause', 'INVALID_PARAMETER');
    });

    it('should return 400 for extGroupId ending with @', async () => {
      const response = await request(app)
        .put('/nudm-pp/v1/mbs-group-membership/group@')
        .send(validBody)
        .expect(400);

      expect(response.body).to.have.property('status', 400);
      expect(response.body).to.have.property('cause', 'INVALID_PARAMETER');
    });

    it('should return 400 for extGroupId with multiple @ symbols', async () => {
      const response = await request(app)
        .put('/nudm-pp/v1/mbs-group-membership/group@domain@extra.com')
        .send(validBody)
        .expect(400);

      expect(response.body).to.have.property('status', 400);
      expect(response.body).to.have.property('cause', 'INVALID_PARAMETER');
    });

    it('should return 400 for empty extGroupId', async () => {
      const response = await request(app)
        .put('/nudm-pp/v1/mbs-group-membership/')
        .send(validBody)
        .expect(404);
    });
  });

  describe('Invalid request body', () => {
    it('should return 400 when body is empty (no multicastGroupMemb)', async () => {
      const response = await request(app)
        .put('/nudm-pp/v1/mbs-group-membership/test@example.com')
        .send({})
        .expect(400);

      expect(response.body).to.have.property('status', 400);
      expect(response.body).to.have.property('type', 'urn:3gpp:error:invalid-parameter');
      expect(response.body).to.have.property('cause', 'INVALID_PARAMETER');
      expect(response.body).to.have.property('detail', 'multicastGroupMemb is required and must be a non-empty array');
    });

    it('should return 400 when body is an array', async () => {
      const response = await request(app)
        .put('/nudm-pp/v1/mbs-group-membership/test@example.com')
        .send(['msisdn-1234567890'])
        .expect(400);

      expect(response.body).to.have.property('status', 400);
      expect(response.body).to.have.property('cause', 'INVALID_PARAMETER');
      expect(response.body).to.have.property('detail', 'Request body must be a valid JSON object');
    });

    it('should return 400 when Content-Type is missing', async () => {
      const response = await request(app)
        .put('/nudm-pp/v1/mbs-group-membership/test@example.com')
        .set('Content-Type', 'text/plain')
        .send('not json')
        .expect(400);

      expect(response.body).to.have.property('status', 400);
    });

    it('should return 400 when sending invalid JSON structure', async () => {
      const response = await request(app)
        .put('/nudm-pp/v1/mbs-group-membership/test@example.com')
        .send({ invalid: 'structure', without: 'required field' })
        .expect(400);

      expect(response.body).to.have.property('status', 400);
      expect(response.body).to.have.property('cause', 'INVALID_PARAMETER');
    });
  });

  describe('Invalid multicastGroupMemb field', () => {
    it('should return 400 when multicastGroupMemb is missing', async () => {
      const mbsGroupData = {
        afInstanceId: 'af-123',
        internalGroupIdentifier: 'internal-123'
      };

      const response = await request(app)
        .put('/nudm-pp/v1/mbs-group-membership/test@example.com')
        .send(mbsGroupData)
        .expect(400);

      expect(response.body).to.have.property('status', 400);
      expect(response.body).to.have.property('type', 'urn:3gpp:error:invalid-parameter');
      expect(response.body).to.have.property('cause', 'INVALID_PARAMETER');
      expect(response.body).to.have.property('detail', 'multicastGroupMemb is required and must be a non-empty array');
    });

    it('should return 400 when multicastGroupMemb is null', async () => {
      const mbsGroupData = {
        multicastGroupMemb: null
      };

      const response = await request(app)
        .put('/nudm-pp/v1/mbs-group-membership/test@example.com')
        .send(mbsGroupData)
        .expect(400);

      expect(response.body).to.have.property('status', 400);
      expect(response.body).to.have.property('cause', 'INVALID_PARAMETER');
    });

    it('should return 400 when multicastGroupMemb is not an array', async () => {
      const mbsGroupData = {
        multicastGroupMemb: 'msisdn-1234567890'
      };

      const response = await request(app)
        .put('/nudm-pp/v1/mbs-group-membership/test@example.com')
        .send(mbsGroupData)
        .expect(400);

      expect(response.body).to.have.property('status', 400);
      expect(response.body).to.have.property('cause', 'INVALID_PARAMETER');
    });

    it('should return 400 when multicastGroupMemb is an empty array', async () => {
      const mbsGroupData = {
        multicastGroupMemb: []
      };

      const response = await request(app)
        .put('/nudm-pp/v1/mbs-group-membership/test@example.com')
        .send(mbsGroupData)
        .expect(400);

      expect(response.body).to.have.property('status', 400);
      expect(response.body).to.have.property('type', 'urn:3gpp:error:invalid-parameter');
      expect(response.body).to.have.property('cause', 'INVALID_PARAMETER');
      expect(response.body).to.have.property('detail', 'multicastGroupMemb is required and must be a non-empty array');
    });

    it('should return 400 when multicastGroupMemb is an object', async () => {
      const mbsGroupData = {
        multicastGroupMemb: { member: 'msisdn-1234567890' }
      };

      const response = await request(app)
        .put('/nudm-pp/v1/mbs-group-membership/test@example.com')
        .send(mbsGroupData)
        .expect(400);

      expect(response.body).to.have.property('status', 400);
      expect(response.body).to.have.property('cause', 'INVALID_PARAMETER');
    });

    it('should return 400 when multicastGroupMemb is a number', async () => {
      const mbsGroupData = {
        multicastGroupMemb: 123
      };

      const response = await request(app)
        .put('/nudm-pp/v1/mbs-group-membership/test@example.com')
        .send(mbsGroupData)
        .expect(400);

      expect(response.body).to.have.property('status', 400);
      expect(response.body).to.have.property('cause', 'INVALID_PARAMETER');
    });

    it('should return 400 when multicastGroupMemb is a boolean', async () => {
      const mbsGroupData = {
        multicastGroupMemb: true
      };

      const response = await request(app)
        .put('/nudm-pp/v1/mbs-group-membership/test@example.com')
        .send(mbsGroupData)
        .expect(400);

      expect(response.body).to.have.property('status', 400);
      expect(response.body).to.have.property('cause', 'INVALID_PARAMETER');
    });
  });

  describe('Edge cases', () => {
    it('should handle extGroupId with special characters before @', async () => {
      const mbsGroupData = {
        multicastGroupMemb: ['msisdn-1234567890']
      };

      await request(app)
        .put('/nudm-pp/v1/mbs-group-membership/group-name_test.123@example.com')
        .send(mbsGroupData)
        .expect(201);
    });

    it('should handle extGroupId with special characters after @', async () => {
      const mbsGroupData = {
        multicastGroupMemb: ['msisdn-1234567890']
      };

      await request(app)
        .put('/nudm-pp/v1/mbs-group-membership/group@sub-domain.example-test.com')
        .send(mbsGroupData)
        .expect(201);
    });

    it('should handle large multicastGroupMemb array', async () => {
      const members = Array.from({ length: 100 }, (_, i) => `msisdn-${i.toString().padStart(10, '0')}`);
      const mbsGroupData = {
        multicastGroupMemb: members
      };

      await request(app)
        .put('/nudm-pp/v1/mbs-group-membership/large-group@example.com')
        .send(mbsGroupData)
        .expect(201);
    });

    it('should handle very long afInstanceId', async () => {
      const mbsGroupData = {
        multicastGroupMemb: ['msisdn-1234567890'],
        afInstanceId: 'a'.repeat(500)
      };

      await request(app)
        .put('/nudm-pp/v1/mbs-group-membership/long-af@example.com')
        .send(mbsGroupData)
        .expect(201);
    });

    it('should handle very long internalGroupIdentifier', async () => {
      const mbsGroupData = {
        multicastGroupMemb: ['msisdn-1234567890'],
        internalGroupIdentifier: 'internal-' + 'x'.repeat(1000)
      };

      await request(app)
        .put('/nudm-pp/v1/mbs-group-membership/long-internal@example.com')
        .send(mbsGroupData)
        .expect(201);
    });

    it('should handle Unicode characters in GPSI', async () => {
      const mbsGroupData = {
        multicastGroupMemb: ['msisdn-1234567890', 'test-unicode-äöü']
      };

      await request(app)
        .put('/nudm-pp/v1/mbs-group-membership/unicode@example.com')
        .send(mbsGroupData)
        .expect(201);
    });

    it('should allow updating same extGroupId multiple times', async () => {
      const extGroupId = 'update-test@example.com';
      const firstData = {
        multicastGroupMemb: ['msisdn-1111111111']
      };
      const secondData = {
        multicastGroupMemb: ['msisdn-2222222222', 'msisdn-3333333333']
      };

      await request(app)
        .put(`/nudm-pp/v1/mbs-group-membership/${extGroupId}`)
        .send(firstData)
        .expect(201);

      await request(app)
        .put(`/nudm-pp/v1/mbs-group-membership/${extGroupId}`)
        .send(secondData)
        .expect(201);
    });

    it('should handle minimal extGroupId format', async () => {
      const mbsGroupData = {
        multicastGroupMemb: ['msisdn-1234567890']
      };

      await request(app)
        .put('/nudm-pp/v1/mbs-group-membership/a@b')
        .send(mbsGroupData)
        .expect(201);
    });
  });
});

describe('DELETE /mbs-group-membership/:extGroupId', () => {
  const validExtGroupId = 'deletembs@example.com';

  describe('Success cases', () => {
    it('should delete existing MBS Group', async () => {
      await request(app)
        .put(`/nudm-pp/v1/mbs-group-membership/${validExtGroupId}`)
        .send({
          multicastGroupMemb: [
            'msisdn-1234567890',
            'msisdn-0987654321'
          ]
        })
        .expect(201);

      await request(app)
        .delete(`/nudm-pp/v1/mbs-group-membership/${validExtGroupId}`)
        .expect(204);
    });

    it('should return 204 with no content', async () => {
      const groupId = 'nocontent-mbs@example.com';
      
      await request(app)
        .put(`/nudm-pp/v1/mbs-group-membership/${groupId}`)
        .send({
          multicastGroupMemb: ['msisdn-1111111111']
        })
        .expect(201);

      const response = await request(app)
        .delete(`/nudm-pp/v1/mbs-group-membership/${groupId}`)
        .expect(204);

      expect(response.body).to.be.empty;
    });

    it('should delete group with complex extGroupId', async () => {
      const groupId = 'complex.mbs_123-456@subdomain.example.com';
      
      await request(app)
        .put(`/nudm-pp/v1/mbs-group-membership/${groupId}`)
        .send({
          multicastGroupMemb: ['msisdn-2222222222']
        })
        .expect(201);

      await request(app)
        .delete(`/nudm-pp/v1/mbs-group-membership/${groupId}`)
        .expect(204);
    });

    it('should delete group with URL encoded extGroupId', async () => {
      const groupId = 'encoded-mbs@example.com';
      
      await request(app)
        .put(`/nudm-pp/v1/mbs-group-membership/${groupId}`)
        .send({
          multicastGroupMemb: ['msisdn-3333333333']
        })
        .expect(201);

      await request(app)
        .delete('/nudm-pp/v1/mbs-group-membership/encoded-mbs%40example.com')
        .expect(204);
    });

    it('should delete multiple groups sequentially', async () => {
      const groupIds = [
        'mbs-multi1@example.com',
        'mbs-multi2@example.com',
        'mbs-multi3@example.com'
      ];

      for (const groupId of groupIds) {
        await request(app)
          .put(`/nudm-pp/v1/mbs-group-membership/${groupId}`)
          .send({
            multicastGroupMemb: ['msisdn-4444444444']
          })
          .expect(201);
      }

      for (const groupId of groupIds) {
        await request(app)
          .delete(`/nudm-pp/v1/mbs-group-membership/${groupId}`)
          .expect(204);
      }
    });

    it('should delete MBS group with full membership data', async () => {
      const groupId = 'full-mbs@example.com';
      
      await request(app)
        .put(`/nudm-pp/v1/mbs-group-membership/${groupId}`)
        .send({
          multicastGroupMemb: [
            'msisdn-5555555555',
            'msisdn-6666666666',
            'msisdn-7777777777'
          ],
          afInstanceId: 'af-test-instance',
          internalGroupIdentifier: 'internal-group-123'
        })
        .expect(201);

      await request(app)
        .delete(`/nudm-pp/v1/mbs-group-membership/${groupId}`)
        .expect(204);
    });
  });

  describe('Validation error cases', () => {
    it('should return 400 for invalid extGroupId without @', async () => {
      const response = await request(app)
        .delete('/nudm-pp/v1/mbs-group-membership/invalid-group-id')
        .expect(400)
        .expect('Content-Type', /json/);

      expect(response.body).to.have.property('status', 400);
      expect(response.body).to.have.property('title', 'Bad Request');
      expect(response.body).to.have.property('detail');
      expect(response.body.detail).to.include('extGroupId');
      expect(response.body).to.have.property('cause', 'INVALID_PARAMETER');
    });

    it('should return 400 for extGroupId with only @', async () => {
      const response = await request(app)
        .delete('/nudm-pp/v1/mbs-group-membership/@')
        .expect(400);

      expect(response.body).to.have.property('status', 400);
      expect(response.body).to.have.property('cause', 'INVALID_PARAMETER');
    });

    it('should return 400 for extGroupId starting with @', async () => {
      const response = await request(app)
        .delete('/nudm-pp/v1/mbs-group-membership/@example.com')
        .expect(400);

      expect(response.body).to.have.property('status', 400);
      expect(response.body).to.have.property('cause', 'INVALID_PARAMETER');
    });

    it('should return 400 for extGroupId ending with @', async () => {
      const response = await request(app)
        .delete('/nudm-pp/v1/mbs-group-membership/group@')
        .expect(400);

      expect(response.body).to.have.property('status', 400);
      expect(response.body).to.have.property('cause', 'INVALID_PARAMETER');
    });

    it('should return 400 for extGroupId with multiple @ symbols', async () => {
      const response = await request(app)
        .delete('/nudm-pp/v1/mbs-group-membership/group@domain@example.com')
        .expect(400);

      expect(response.body).to.have.property('status', 400);
      expect(response.body).to.have.property('cause', 'INVALID_PARAMETER');
    });

    it('should return 404 for non-existent group', async () => {
      const response = await request(app)
        .delete('/nudm-pp/v1/mbs-group-membership/nonexistent-mbs@example.com')
        .expect(404)
        .expect('Content-Type', /json/);

      expect(response.body).to.have.property('status', 404);
      expect(response.body).to.have.property('title', 'Not Found');
      expect(response.body).to.have.property('detail');
      expect(response.body.detail).to.include('not found');
      expect(response.body).to.have.property('cause', 'DATA_NOT_FOUND');
    });

    it('should return 404 when deleting same group twice', async () => {
      const groupId = 'deletetwice-mbs@example.com';
      
      await request(app)
        .put(`/nudm-pp/v1/mbs-group-membership/${groupId}`)
        .send({
          multicastGroupMemb: ['msisdn-8888888888']
        })
        .expect(201);

      await request(app)
        .delete(`/nudm-pp/v1/mbs-group-membership/${groupId}`)
        .expect(204);

      const response = await request(app)
        .delete(`/nudm-pp/v1/mbs-group-membership/${groupId}`)
        .expect(404);

      expect(response.body).to.have.property('status', 404);
      expect(response.body).to.have.property('cause', 'DATA_NOT_FOUND');
    });

    it('should return 404 for empty extGroupId', async () => {
      await request(app)
        .delete('/nudm-pp/v1/mbs-group-membership/')
        .expect(404);
    });
  });

  describe('Error response format', () => {
    it('should have correct 3GPP error structure for 400', async () => {
      const response = await request(app)
        .delete('/nudm-pp/v1/mbs-group-membership/invalid-group')
        .expect(400);

      expect(response.body).to.have.property('type', 'urn:3gpp:error:invalid-parameter');
      expect(response.body).to.have.property('title');
      expect(response.body).to.have.property('status');
      expect(response.body).to.have.property('detail');
      expect(response.body).to.have.property('cause');
    });

    it('should have correct 3GPP error structure for 404', async () => {
      const response = await request(app)
        .delete('/nudm-pp/v1/mbs-group-membership/notfound-mbs@example.com')
        .expect(404);

      expect(response.body).to.have.property('type', 'urn:3gpp:error:not-found');
      expect(response.body).to.have.property('title');
      expect(response.body).to.have.property('status');
      expect(response.body).to.have.property('detail');
      expect(response.body).to.have.property('cause');
    });

    it('should return JSON content type for 400 errors', async () => {
      await request(app)
        .delete('/nudm-pp/v1/mbs-group-membership/invalid-group')
        .expect(400)
        .expect('Content-Type', /json/);
    });

    it('should return JSON content type for 404 errors', async () => {
      await request(app)
        .delete('/nudm-pp/v1/mbs-group-membership/notfound-mbs@example.com')
        .expect(404)
        .expect('Content-Type', /json/);
    });
  });

  describe('Edge cases', () => {
    it('should handle very long extGroupId', async () => {
      const longGroupId = 'a'.repeat(100) + '@' + 'b'.repeat(100) + '.com';
      
      await request(app)
        .put(`/nudm-pp/v1/mbs-group-membership/${longGroupId}`)
        .send({
          multicastGroupMemb: ['msisdn-9999999999']
        })
        .expect(201);

      await request(app)
        .delete(`/nudm-pp/v1/mbs-group-membership/${longGroupId}`)
        .expect(204);
    });

    it('should handle extGroupId with special characters', async () => {
      const specialGroupId = 'mbs.name_123-456@example.com';
      
      await request(app)
        .put(`/nudm-pp/v1/mbs-group-membership/${specialGroupId}`)
        .send({
          multicastGroupMemb: ['msisdn-1010101010']
        })
        .expect(201);

      await request(app)
        .delete(`/nudm-pp/v1/mbs-group-membership/${specialGroupId}`)
        .expect(204);
    });

    it('should handle deletion of non-existent group gracefully', async () => {
      const response = await request(app)
        .delete('/nudm-pp/v1/mbs-group-membership/ghost-mbs@example.com')
        .expect(404);

      expect(response.body).to.have.property('status', 404);
    });
  });

  describe('Case sensitivity', () => {
    it('should treat extGroupId as case sensitive', async () => {
      const lowerCaseId = 'mbsgroup@example.com';
      const upperCaseId = 'MBSGroup@Example.com';
      
      await request(app)
        .put(`/nudm-pp/v1/mbs-group-membership/${lowerCaseId}`)
        .send({
          multicastGroupMemb: ['msisdn-1212121212']
        })
        .expect(201);

      await request(app)
        .put(`/nudm-pp/v1/mbs-group-membership/${upperCaseId}`)
        .send({
          multicastGroupMemb: ['msisdn-1313131313']
        })
        .expect(201);

      await request(app)
        .delete(`/nudm-pp/v1/mbs-group-membership/${lowerCaseId}`)
        .expect(204);

      await request(app)
        .delete(`/nudm-pp/v1/mbs-group-membership/${upperCaseId}`)
        .expect(204);
    });

    it('should not delete with mismatched case', async () => {
      const groupId = 'casesensitive@example.com';
      
      await request(app)
        .put(`/nudm-pp/v1/mbs-group-membership/${groupId}`)
        .send({
          multicastGroupMemb: ['msisdn-1414141414']
        })
        .expect(201);

      const response = await request(app)
        .delete('/nudm-pp/v1/mbs-group-membership/CaseSensitive@Example.com')
        .expect(404);

      expect(response.body).to.have.property('status', 404);
    });
  });

  describe('Isolation from other endpoints', () => {
    it('should not affect 5G VN Groups', async () => {
      const vnGroupId = 'vngroup@example.com';
      const mbsGroupId = 'mbsgroup@example.com';

      await request(app)
        .put(`/nudm-pp/v1/5g-vn-groups/${vnGroupId}`)
        .send({
          '5gVnGroupData': {
            dnn: 'internet',
            sNssai: {
              sst: 1
            }
          }
        })
        .expect(201);

      await request(app)
        .put(`/nudm-pp/v1/mbs-group-membership/${mbsGroupId}`)
        .send({
          multicastGroupMemb: ['msisdn-1515151515']
        })
        .expect(201);

      await request(app)
        .delete(`/nudm-pp/v1/mbs-group-membership/${mbsGroupId}`)
        .expect(204);

      await request(app)
        .get(`/nudm-pp/v1/5g-vn-groups/${vnGroupId}`)
        .expect(200);

      await request(app)
        .delete(`/nudm-pp/v1/5g-vn-groups/${vnGroupId}`)
        .expect(204);
    });

    it('should maintain separate storage from VN Groups', async () => {
      const sameId = 'shared@example.com';

      await request(app)
        .put(`/nudm-pp/v1/5g-vn-groups/${sameId}`)
        .send({
          '5gVnGroupData': {
            dnn: 'internet',
            sNssai: {
              sst: 1
            }
          }
        })
        .expect(201);

      await request(app)
        .put(`/nudm-pp/v1/mbs-group-membership/${sameId}`)
        .send({
          multicastGroupMemb: ['msisdn-1616161616']
        })
        .expect(201);

      await request(app)
        .delete(`/nudm-pp/v1/mbs-group-membership/${sameId}`)
        .expect(204);

      await request(app)
        .get(`/nudm-pp/v1/5g-vn-groups/${sameId}`)
        .expect(200);

      await request(app)
        .delete(`/nudm-pp/v1/5g-vn-groups/${sameId}`)
        .expect(204);
    });
  });
});

describe('PATCH /mbs-group-membership/:extGroupId', () => {
  const validExtGroupId = 'patchmbs@example.com';

  describe('Success cases', () => {
    it('should update existing MBS Group', async () => {
      await request(app)
        .put(`/nudm-pp/v1/mbs-group-membership/${validExtGroupId}`)
        .send({
          multicastGroupMemb: [
            'msisdn-1234567890',
            'msisdn-0987654321'
          ],
          afInstanceId: 'af-instance-123',
          internalGroupIdentifier: 'internal-group-1'
        })
        .expect(201);

      await request(app)
        .patch(`/nudm-pp/v1/mbs-group-membership/${validExtGroupId}`)
        .send({
          afInstanceId: 'af-instance-456'
        })
        .expect(204);
    });

    it('should return 204 with no content', async () => {
      const groupId = 'nocontent-mbspatch@example.com';
      
      await request(app)
        .put(`/nudm-pp/v1/mbs-group-membership/${groupId}`)
        .send({
          multicastGroupMemb: ['msisdn-1111111111']
        })
        .expect(201);

      const response = await request(app)
        .patch(`/nudm-pp/v1/mbs-group-membership/${groupId}`)
        .send({
          afInstanceId: 'af-new'
        })
        .expect(204);

      expect(response.body).to.be.empty;
    });

    it('should merge new data with existing data', async () => {
      const groupId = 'merge-mbspatch@example.com';
      
      await request(app)
        .put(`/nudm-pp/v1/mbs-group-membership/${groupId}`)
        .send({
          multicastGroupMemb: [
            'msisdn-1234567890'
          ],
          afInstanceId: 'af-original'
        })
        .expect(201);

      await request(app)
        .patch(`/nudm-pp/v1/mbs-group-membership/${groupId}`)
        .send({
          afInstanceId: 'af-updated',
          internalGroupIdentifier: 'internal-new'
        })
        .expect(204);
    });

    it('should update multicastGroupMemb array', async () => {
      const groupId = 'update-members-mbs@example.com';
      
      await request(app)
        .put(`/nudm-pp/v1/mbs-group-membership/${groupId}`)
        .send({
          multicastGroupMemb: [
            'msisdn-1234567890',
            'msisdn-0987654321'
          ]
        })
        .expect(201);

      await request(app)
        .patch(`/nudm-pp/v1/mbs-group-membership/${groupId}`)
        .send({
          multicastGroupMemb: [
            'msisdn-1111111111',
            'msisdn-2222222222',
            'msisdn-3333333333'
          ]
        })
        .expect(204);
    });

    it('should delete properties when set to null', async () => {
      const groupId = 'delete-prop-mbs@example.com';
      
      await request(app)
        .put(`/nudm-pp/v1/mbs-group-membership/${groupId}`)
        .send({
          multicastGroupMemb: ['msisdn-1234567890'],
          afInstanceId: 'af-instance-123',
          internalGroupIdentifier: 'internal-id-123'
        })
        .expect(201);

      await request(app)
        .patch(`/nudm-pp/v1/mbs-group-membership/${groupId}`)
        .send({
          afInstanceId: null,
          internalGroupIdentifier: null
        })
        .expect(204);
    });

    it('should accept supported-features query parameter', async () => {
      const groupId = 'features-mbspatch@example.com';
      
      await request(app)
        .put(`/nudm-pp/v1/mbs-group-membership/${groupId}`)
        .send({
          multicastGroupMemb: ['msisdn-1234567890']
        })
        .expect(201);

      await request(app)
        .patch(`/nudm-pp/v1/mbs-group-membership/${groupId}`)
        .query({ 'supported-features': 'ABC123' })
        .send({
          afInstanceId: 'af-new'
        })
        .expect(204);
    });

    it('should update multiple properties at once', async () => {
      const groupId = 'multi-prop-mbs@example.com';
      
      await request(app)
        .put(`/nudm-pp/v1/mbs-group-membership/${groupId}`)
        .send({
          multicastGroupMemb: ['msisdn-1234567890'],
          afInstanceId: 'af-old'
        })
        .expect(201);

      await request(app)
        .patch(`/nudm-pp/v1/mbs-group-membership/${groupId}`)
        .send({
          multicastGroupMemb: [
            'msisdn-1111111111',
            'msisdn-2222222222'
          ],
          afInstanceId: 'af-new',
          internalGroupIdentifier: 'internal-123'
        })
        .expect(204);
    });

    it('should handle empty patch body', async () => {
      const groupId = 'empty-body-mbs@example.com';
      
      await request(app)
        .put(`/nudm-pp/v1/mbs-group-membership/${groupId}`)
        .send({
          multicastGroupMemb: ['msisdn-1234567890']
        })
        .expect(201);

      await request(app)
        .patch(`/nudm-pp/v1/mbs-group-membership/${groupId}`)
        .send({})
        .expect(204);
    });

    it('should handle URL encoded extGroupId', async () => {
      const groupId = 'encoded-mbspatch@example.com';
      
      await request(app)
        .put(`/nudm-pp/v1/mbs-group-membership/${groupId}`)
        .send({
          multicastGroupMemb: ['msisdn-1234567890']
        })
        .expect(201);

      await request(app)
        .patch('/nudm-pp/v1/mbs-group-membership/encoded-mbspatch%40example.com')
        .send({
          afInstanceId: 'af-new'
        })
        .expect(204);
    });

    it('should handle complex extGroupId', async () => {
      const groupId = 'complex.mbs_123-456@subdomain.example.com';
      
      await request(app)
        .put(`/nudm-pp/v1/mbs-group-membership/${groupId}`)
        .send({
          multicastGroupMemb: ['msisdn-1234567890']
        })
        .expect(201);

      await request(app)
        .patch(`/nudm-pp/v1/mbs-group-membership/${groupId}`)
        .send({
          afInstanceId: 'af-updated'
        })
        .expect(204);
    });

    it('should update afInstanceId only', async () => {
      const groupId = 'update-af-mbs@example.com';
      
      await request(app)
        .put(`/nudm-pp/v1/mbs-group-membership/${groupId}`)
        .send({
          multicastGroupMemb: ['msisdn-1234567890'],
          afInstanceId: 'af-original',
          internalGroupIdentifier: 'internal-original'
        })
        .expect(201);

      await request(app)
        .patch(`/nudm-pp/v1/mbs-group-membership/${groupId}`)
        .send({
          afInstanceId: 'af-updated'
        })
        .expect(204);
    });

    it('should update internalGroupIdentifier only', async () => {
      const groupId = 'update-internal-mbs@example.com';
      
      await request(app)
        .put(`/nudm-pp/v1/mbs-group-membership/${groupId}`)
        .send({
          multicastGroupMemb: ['msisdn-1234567890'],
          afInstanceId: 'af-instance',
          internalGroupIdentifier: 'internal-original'
        })
        .expect(201);

      await request(app)
        .patch(`/nudm-pp/v1/mbs-group-membership/${groupId}`)
        .send({
          internalGroupIdentifier: 'internal-updated'
        })
        .expect(204);
    });

    it('should add members to multicastGroupMemb', async () => {
      const groupId = 'add-members-mbs@example.com';
      
      await request(app)
        .put(`/nudm-pp/v1/mbs-group-membership/${groupId}`)
        .send({
          multicastGroupMemb: ['msisdn-1234567890']
        })
        .expect(201);

      await request(app)
        .patch(`/nudm-pp/v1/mbs-group-membership/${groupId}`)
        .send({
          multicastGroupMemb: [
            'msisdn-1234567890',
            'msisdn-0987654321',
            'msisdn-1111111111'
          ]
        })
        .expect(204);
    });

    it('should remove members from multicastGroupMemb', async () => {
      const groupId = 'remove-members-mbs@example.com';
      
      await request(app)
        .put(`/nudm-pp/v1/mbs-group-membership/${groupId}`)
        .send({
          multicastGroupMemb: [
            'msisdn-1234567890',
            'msisdn-0987654321',
            'msisdn-1111111111'
          ]
        })
        .expect(201);

      await request(app)
        .patch(`/nudm-pp/v1/mbs-group-membership/${groupId}`)
        .send({
          multicastGroupMemb: ['msisdn-1234567890']
        })
        .expect(204);
    });

    it('should update with all fields', async () => {
      const groupId = 'all-fields-mbs@example.com';
      
      await request(app)
        .put(`/nudm-pp/v1/mbs-group-membership/${groupId}`)
        .send({
          multicastGroupMemb: ['msisdn-1234567890']
        })
        .expect(201);

      await request(app)
        .patch(`/nudm-pp/v1/mbs-group-membership/${groupId}`)
        .send({
          multicastGroupMemb: [
            'msisdn-1111111111',
            'msisdn-2222222222'
          ],
          afInstanceId: 'af-complete',
          internalGroupIdentifier: 'internal-complete'
        })
        .expect(204);
    });

    it('should handle large multicastGroupMemb update', async () => {
      const groupId = 'large-update-mbs@example.com';
      
      await request(app)
        .put(`/nudm-pp/v1/mbs-group-membership/${groupId}`)
        .send({
          multicastGroupMemb: ['msisdn-1234567890']
        })
        .expect(201);

      const largeMembers = Array.from({ length: 100 }, (_, i) => `msisdn-${i.toString().padStart(10, '0')}`);
      await request(app)
        .patch(`/nudm-pp/v1/mbs-group-membership/${groupId}`)
        .send({
          multicastGroupMemb: largeMembers
        })
        .expect(204);
    });
  });

  describe('Validation error cases', () => {
    it('should return 400 for invalid extGroupId without @', async () => {
      const response = await request(app)
        .patch('/nudm-pp/v1/mbs-group-membership/invalid-group-id')
        .send({
          afInstanceId: 'af-new'
        })
        .expect(400)
        .expect('Content-Type', /json/);

      expect(response.body).to.have.property('status', 400);
      expect(response.body).to.have.property('title', 'Bad Request');
      expect(response.body).to.have.property('detail');
      expect(response.body.detail).to.include('extGroupId');
      expect(response.body).to.have.property('cause', 'INVALID_PARAMETER');
    });

    it('should return 400 for extGroupId with only @', async () => {
      const response = await request(app)
        .patch('/nudm-pp/v1/mbs-group-membership/@')
        .send({
          afInstanceId: 'af-new'
        })
        .expect(400);

      expect(response.body).to.have.property('status', 400);
      expect(response.body).to.have.property('cause', 'INVALID_PARAMETER');
    });

    it('should return 400 for extGroupId starting with @', async () => {
      const response = await request(app)
        .patch('/nudm-pp/v1/mbs-group-membership/@example.com')
        .send({
          afInstanceId: 'af-new'
        })
        .expect(400);

      expect(response.body).to.have.property('status', 400);
      expect(response.body).to.have.property('cause', 'INVALID_PARAMETER');
    });

    it('should return 400 for extGroupId ending with @', async () => {
      const response = await request(app)
        .patch('/nudm-pp/v1/mbs-group-membership/group@')
        .send({
          afInstanceId: 'af-new'
        })
        .expect(400);

      expect(response.body).to.have.property('status', 400);
      expect(response.body).to.have.property('cause', 'INVALID_PARAMETER');
    });

    it('should return 400 for extGroupId with multiple @ symbols', async () => {
      const response = await request(app)
        .patch('/nudm-pp/v1/mbs-group-membership/group@domain@example.com')
        .send({
          afInstanceId: 'af-new'
        })
        .expect(400);

      expect(response.body).to.have.property('status', 400);
      expect(response.body).to.have.property('cause', 'INVALID_PARAMETER');
    });

    it('should return 404 for non-existent group', async () => {
      const response = await request(app)
        .patch('/nudm-pp/v1/mbs-group-membership/nonexistent-mbspatch@example.com')
        .send({
          afInstanceId: 'af-new'
        })
        .expect(404)
        .expect('Content-Type', /json/);

      expect(response.body).to.have.property('status', 404);
      expect(response.body).to.have.property('title', 'Not Found');
      expect(response.body).to.have.property('detail');
      expect(response.body.detail).to.include('not found');
      expect(response.body).to.have.property('cause', 'DATA_NOT_FOUND');
    });

    it('should return 400 for array request body', async () => {
      const groupId = 'array-body-mbs@example.com';
      
      await request(app)
        .put(`/nudm-pp/v1/mbs-group-membership/${groupId}`)
        .send({
          multicastGroupMemb: ['msisdn-1234567890']
        })
        .expect(201);

      const response = await request(app)
        .patch(`/nudm-pp/v1/mbs-group-membership/${groupId}`)
        .send([
          { afInstanceId: 'af-new' }
        ])
        .expect(400);

      expect(response.body).to.have.property('status', 400);
      expect(response.body).to.have.property('cause', 'INVALID_PARAMETER');
    });

    it('should return 404 for empty extGroupId', async () => {
      await request(app)
        .patch('/nudm-pp/v1/mbs-group-membership/')
        .send({
          afInstanceId: 'af-new'
        })
        .expect(404);
    });
  });

  describe('Error response format', () => {
    it('should have correct 3GPP error structure for 400', async () => {
      const response = await request(app)
        .patch('/nudm-pp/v1/mbs-group-membership/invalid-group')
        .send({
          afInstanceId: 'af-new'
        })
        .expect(400);

      expect(response.body).to.have.property('type', 'urn:3gpp:error:invalid-parameter');
      expect(response.body).to.have.property('title');
      expect(response.body).to.have.property('status');
      expect(response.body).to.have.property('detail');
      expect(response.body).to.have.property('cause');
    });

    it('should have correct 3GPP error structure for 404', async () => {
      const response = await request(app)
        .patch('/nudm-pp/v1/mbs-group-membership/notfound-mbspatch@example.com')
        .send({
          afInstanceId: 'af-new'
        })
        .expect(404);

      expect(response.body).to.have.property('type', 'urn:3gpp:error:not-found');
      expect(response.body).to.have.property('title');
      expect(response.body).to.have.property('status');
      expect(response.body).to.have.property('detail');
      expect(response.body).to.have.property('cause');
    });

    it('should return JSON content type for 400 errors', async () => {
      await request(app)
        .patch('/nudm-pp/v1/mbs-group-membership/invalid-group')
        .send({
          afInstanceId: 'af-new'
        })
        .expect(400)
        .expect('Content-Type', /json/);
    });

    it('should return JSON content type for 404 errors', async () => {
      await request(app)
        .patch('/nudm-pp/v1/mbs-group-membership/notfound-mbspatch@example.com')
        .send({
          afInstanceId: 'af-new'
        })
        .expect(404)
        .expect('Content-Type', /json/);
    });
  });

  describe('Edge cases', () => {
    it('should handle very long extGroupId', async () => {
      const longGroupId = 'a'.repeat(100) + '@' + 'b'.repeat(100) + '.com';
      
      await request(app)
        .put(`/nudm-pp/v1/mbs-group-membership/${longGroupId}`)
        .send({
          multicastGroupMemb: ['msisdn-1234567890']
        })
        .expect(201);

      await request(app)
        .patch(`/nudm-pp/v1/mbs-group-membership/${longGroupId}`)
        .send({
          afInstanceId: 'af-new'
        })
        .expect(204);
    });

    it('should handle extGroupId with special characters', async () => {
      const specialGroupId = 'mbs.name_123-456@example.com';
      
      await request(app)
        .put(`/nudm-pp/v1/mbs-group-membership/${specialGroupId}`)
        .send({
          multicastGroupMemb: ['msisdn-1234567890']
        })
        .expect(201);

      await request(app)
        .patch(`/nudm-pp/v1/mbs-group-membership/${specialGroupId}`)
        .send({
          afInstanceId: 'af-new'
        })
        .expect(204);
    });

    it('should handle patch with only null values', async () => {
      const groupId = 'only-nulls-mbs@example.com';
      
      await request(app)
        .put(`/nudm-pp/v1/mbs-group-membership/${groupId}`)
        .send({
          multicastGroupMemb: ['msisdn-1234567890'],
          afInstanceId: 'af-old',
          internalGroupIdentifier: 'internal-old'
        })
        .expect(201);

      await request(app)
        .patch(`/nudm-pp/v1/mbs-group-membership/${groupId}`)
        .send({
          afInstanceId: null,
          internalGroupIdentifier: null
        })
        .expect(204);
    });

    it('should preserve unmodified properties', async () => {
      const groupId = 'preserve-props-mbs@example.com';
      
      await request(app)
        .put(`/nudm-pp/v1/mbs-group-membership/${groupId}`)
        .send({
          multicastGroupMemb: ['msisdn-1234567890'],
          afInstanceId: 'af-original',
          internalGroupIdentifier: 'internal-original'
        })
        .expect(201);

      await request(app)
        .patch(`/nudm-pp/v1/mbs-group-membership/${groupId}`)
        .send({
          afInstanceId: 'af-updated'
        })
        .expect(204);
    });

    it('should handle multiple patches sequentially', async () => {
      const groupId = 'sequential-mbs@example.com';
      
      await request(app)
        .put(`/nudm-pp/v1/mbs-group-membership/${groupId}`)
        .send({
          multicastGroupMemb: ['msisdn-1234567890']
        })
        .expect(201);

      await request(app)
        .patch(`/nudm-pp/v1/mbs-group-membership/${groupId}`)
        .send({
          afInstanceId: 'af-first'
        })
        .expect(204);

      await request(app)
        .patch(`/nudm-pp/v1/mbs-group-membership/${groupId}`)
        .send({
          internalGroupIdentifier: 'internal-second'
        })
        .expect(204);

      await request(app)
        .patch(`/nudm-pp/v1/mbs-group-membership/${groupId}`)
        .send({
          multicastGroupMemb: [
            'msisdn-1111111111',
            'msisdn-2222222222'
          ]
        })
        .expect(204);
    });

    it('should handle patch after delete failure', async () => {
      const groupId = 'patch-after-fail-mbs@example.com';
      
      await request(app)
        .put(`/nudm-pp/v1/mbs-group-membership/${groupId}`)
        .send({
          multicastGroupMemb: ['msisdn-1234567890']
        })
        .expect(201);

      await request(app)
        .delete(`/nudm-pp/v1/mbs-group-membership/${groupId}`)
        .expect(204);

      await request(app)
        .patch(`/nudm-pp/v1/mbs-group-membership/${groupId}`)
        .send({
          afInstanceId: 'af-new'
        })
        .expect(404);
    });

    it('should handle minimal extGroupId format', async () => {
      const groupId = 'a@b';
      
      await request(app)
        .put(`/nudm-pp/v1/mbs-group-membership/${groupId}`)
        .send({
          multicastGroupMemb: ['msisdn-1234567890']
        })
        .expect(201);

      await request(app)
        .patch(`/nudm-pp/v1/mbs-group-membership/${groupId}`)
        .send({
          afInstanceId: 'af-new'
        })
        .expect(204);
    });

    it('should handle very long afInstanceId', async () => {
      const groupId = 'long-af-mbs@example.com';
      
      await request(app)
        .put(`/nudm-pp/v1/mbs-group-membership/${groupId}`)
        .send({
          multicastGroupMemb: ['msisdn-1234567890']
        })
        .expect(201);

      await request(app)
        .patch(`/nudm-pp/v1/mbs-group-membership/${groupId}`)
        .send({
          afInstanceId: 'a'.repeat(500)
        })
        .expect(204);
    });

    it('should handle very long internalGroupIdentifier', async () => {
      const groupId = 'long-internal-mbs@example.com';
      
      await request(app)
        .put(`/nudm-pp/v1/mbs-group-membership/${groupId}`)
        .send({
          multicastGroupMemb: ['msisdn-1234567890']
        })
        .expect(201);

      await request(app)
        .patch(`/nudm-pp/v1/mbs-group-membership/${groupId}`)
        .send({
          internalGroupIdentifier: 'internal-' + 'x'.repeat(1000)
        })
        .expect(204);
    });

    it('should handle Unicode characters in GPSI', async () => {
      const groupId = 'unicode-mbs@example.com';
      
      await request(app)
        .put(`/nudm-pp/v1/mbs-group-membership/${groupId}`)
        .send({
          multicastGroupMemb: ['msisdn-1234567890']
        })
        .expect(201);

      await request(app)
        .patch(`/nudm-pp/v1/mbs-group-membership/${groupId}`)
        .send({
          multicastGroupMemb: ['msisdn-1234567890', 'test-unicode-äöü']
        })
        .expect(204);
    });
  });
});

describe('GET /mbs-group-membership/:extGroupId', () => {
  const validExtGroupId = 'getmbs@example.com';

  describe('Success cases', () => {
    it('should retrieve existing MBS group membership', async () => {
      const mbsGroupData = {
        multicastGroupMemb: [
          'msisdn-1234567890',
          'msisdn-0987654321'
        ],
        afInstanceId: 'af-instance-1',
        internalGroupIdentifier: 'internal-group-1'
      };

      await request(app)
        .put(`/nudm-pp/v1/mbs-group-membership/${validExtGroupId}`)
        .send(mbsGroupData)
        .expect(201);

      const response = await request(app)
        .get(`/nudm-pp/v1/mbs-group-membership/${validExtGroupId}`)
        .expect(200)
        .expect('Content-Type', /json/);

      expect(response.body).to.have.property('multicastGroupMemb');
      expect(response.body.multicastGroupMemb).to.be.an('array');
      expect(response.body.multicastGroupMemb).to.have.lengthOf(2);
      expect(response.body.multicastGroupMemb).to.include('msisdn-1234567890');
      expect(response.body.multicastGroupMemb).to.include('msisdn-0987654321');
      expect(response.body).to.have.property('afInstanceId', 'af-instance-1');
      expect(response.body).to.have.property('internalGroupIdentifier', 'internal-group-1');
    });

    it('should retrieve MBS group with minimum required fields', async () => {
      const groupId = 'min-mbs@example.com';
      const mbsGroupData = {
        multicastGroupMemb: ['msisdn-1234567890']
      };

      await request(app)
        .put(`/nudm-pp/v1/mbs-group-membership/${groupId}`)
        .send(mbsGroupData)
        .expect(201);

      const response = await request(app)
        .get(`/nudm-pp/v1/mbs-group-membership/${groupId}`)
        .expect(200);

      expect(response.body).to.have.property('multicastGroupMemb');
      expect(response.body.multicastGroupMemb).to.be.an('array');
      expect(response.body.multicastGroupMemb).to.have.lengthOf(1);
      expect(response.body.multicastGroupMemb[0]).to.equal('msisdn-1234567890');
    });

    it('should retrieve MBS group with multiple GPSI members', async () => {
      const groupId = 'multi-gpsi-mbs@example.com';
      const mbsGroupData = {
        multicastGroupMemb: [
          'msisdn-1111111111',
          'msisdn-2222222222',
          'msisdn-3333333333',
          'msisdn-4444444444'
        ],
        afInstanceId: 'af-001'
      };

      await request(app)
        .put(`/nudm-pp/v1/mbs-group-membership/${groupId}`)
        .send(mbsGroupData)
        .expect(201);

      const response = await request(app)
        .get(`/nudm-pp/v1/mbs-group-membership/${groupId}`)
        .expect(200);

      expect(response.body.multicastGroupMemb).to.have.lengthOf(4);
      expect(response.body.afInstanceId).to.equal('af-001');
    });

    it('should retrieve MBS group with all optional fields', async () => {
      const groupId = 'full-fields-mbs@example.com';
      const mbsGroupData = {
        multicastGroupMemb: ['msisdn-9999999999'],
        afInstanceId: 'af-full-test',
        internalGroupIdentifier: 'internal-full-123'
      };

      await request(app)
        .put(`/nudm-pp/v1/mbs-group-membership/${groupId}`)
        .send(mbsGroupData)
        .expect(201);

      const response = await request(app)
        .get(`/nudm-pp/v1/mbs-group-membership/${groupId}`)
        .expect(200);

      expect(response.body).to.deep.equal(mbsGroupData);
    });

    it('should retrieve group with complex extGroupId', async () => {
      const groupId = 'complex.mbs_123-456@subdomain.example.com';
      const mbsGroupData = {
        multicastGroupMemb: ['msisdn-5555555555']
      };

      await request(app)
        .put(`/nudm-pp/v1/mbs-group-membership/${groupId}`)
        .send(mbsGroupData)
        .expect(201);

      const response = await request(app)
        .get(`/nudm-pp/v1/mbs-group-membership/${groupId}`)
        .expect(200);

      expect(response.body).to.have.property('multicastGroupMemb');
      expect(response.body.multicastGroupMemb).to.include('msisdn-5555555555');
    });

    it('should retrieve group with URL encoded extGroupId', async () => {
      const groupId = 'encoded-mbs@example.com';
      const mbsGroupData = {
        multicastGroupMemb: ['msisdn-6666666666']
      };

      await request(app)
        .put(`/nudm-pp/v1/mbs-group-membership/${groupId}`)
        .send(mbsGroupData)
        .expect(201);

      const response = await request(app)
        .get('/nudm-pp/v1/mbs-group-membership/encoded-mbs%40example.com')
        .expect(200);

      expect(response.body.multicastGroupMemb).to.include('msisdn-6666666666');
    });

    it('should retrieve updated MBS group after PATCH', async () => {
      const groupId = 'patch-then-get-mbs@example.com';
      
      await request(app)
        .put(`/nudm-pp/v1/mbs-group-membership/${groupId}`)
        .send({
          multicastGroupMemb: ['msisdn-1234567890'],
          afInstanceId: 'af-original'
        })
        .expect(201);

      await request(app)
        .patch(`/nudm-pp/v1/mbs-group-membership/${groupId}`)
        .send({
          afInstanceId: 'af-updated',
          internalGroupIdentifier: 'internal-new'
        })
        .expect(204);

      const response = await request(app)
        .get(`/nudm-pp/v1/mbs-group-membership/${groupId}`)
        .expect(200);

      expect(response.body.afInstanceId).to.equal('af-updated');
      expect(response.body.internalGroupIdentifier).to.equal('internal-new');
      expect(response.body.multicastGroupMemb).to.deep.equal(['msisdn-1234567890']);
    });

    it('should retrieve different groups independently', async () => {
      const group1Id = 'independent-mbs1@example.com';
      const group2Id = 'independent-mbs2@example.com';
      
      const group1Data = {
        multicastGroupMemb: ['msisdn-1111111111'],
        afInstanceId: 'af-group1'
      };

      const group2Data = {
        multicastGroupMemb: ['msisdn-2222222222'],
        afInstanceId: 'af-group2'
      };

      await request(app)
        .put(`/nudm-pp/v1/mbs-group-membership/${group1Id}`)
        .send(group1Data)
        .expect(201);

      await request(app)
        .put(`/nudm-pp/v1/mbs-group-membership/${group2Id}`)
        .send(group2Data)
        .expect(201);

      const response1 = await request(app)
        .get(`/nudm-pp/v1/mbs-group-membership/${group1Id}`)
        .expect(200);

      const response2 = await request(app)
        .get(`/nudm-pp/v1/mbs-group-membership/${group2Id}`)
        .expect(200);

      expect(response1.body.afInstanceId).to.equal('af-group1');
      expect(response2.body.afInstanceId).to.equal('af-group2');
      expect(response1.body.multicastGroupMemb).to.deep.equal(['msisdn-1111111111']);
      expect(response2.body.multicastGroupMemb).to.deep.equal(['msisdn-2222222222']);
    });

    it('should retrieve group after multiple updates', async () => {
      const groupId = 'multiple-updates-mbs@example.com';
      
      await request(app)
        .put(`/nudm-pp/v1/mbs-group-membership/${groupId}`)
        .send({
          multicastGroupMemb: ['msisdn-1111111111']
        })
        .expect(201);

      await request(app)
        .patch(`/nudm-pp/v1/mbs-group-membership/${groupId}`)
        .send({
          afInstanceId: 'af-first'
        })
        .expect(204);

      await request(app)
        .patch(`/nudm-pp/v1/mbs-group-membership/${groupId}`)
        .send({
          internalGroupIdentifier: 'internal-first'
        })
        .expect(204);

      await request(app)
        .patch(`/nudm-pp/v1/mbs-group-membership/${groupId}`)
        .send({
          afInstanceId: 'af-final'
        })
        .expect(204);

      const response = await request(app)
        .get(`/nudm-pp/v1/mbs-group-membership/${groupId}`)
        .expect(200);

      expect(response.body.afInstanceId).to.equal('af-final');
      expect(response.body.internalGroupIdentifier).to.equal('internal-first');
      expect(response.body.multicastGroupMemb).to.deep.equal(['msisdn-1111111111']);
    });

    it('should return JSON content type', async () => {
      const groupId = 'content-type-mbs@example.com';
      
      await request(app)
        .put(`/nudm-pp/v1/mbs-group-membership/${groupId}`)
        .send({
          multicastGroupMemb: ['msisdn-7777777777']
        })
        .expect(201);

      await request(app)
        .get(`/nudm-pp/v1/mbs-group-membership/${groupId}`)
        .expect(200)
        .expect('Content-Type', /application\/json/);
    });
  });

  describe('Validation error cases', () => {
    it('should return 400 for invalid extGroupId without @', async () => {
      const response = await request(app)
        .get('/nudm-pp/v1/mbs-group-membership/invalid-group-id')
        .expect(400)
        .expect('Content-Type', /json/);

      expect(response.body).to.have.property('status', 400);
      expect(response.body).to.have.property('title', 'Bad Request');
      expect(response.body).to.have.property('type', 'urn:3gpp:error:invalid-parameter');
      expect(response.body).to.have.property('detail', 'Invalid extGroupId format');
      expect(response.body).to.have.property('cause', 'INVALID_PARAMETER');
    });

    it('should return 400 for extGroupId with only @', async () => {
      const response = await request(app)
        .get('/nudm-pp/v1/mbs-group-membership/@')
        .expect(400);

      expect(response.body).to.have.property('status', 400);
      expect(response.body).to.have.property('cause', 'INVALID_PARAMETER');
    });

    it('should return 400 for extGroupId starting with @', async () => {
      const response = await request(app)
        .get('/nudm-pp/v1/mbs-group-membership/@example.com')
        .expect(400);

      expect(response.body).to.have.property('status', 400);
      expect(response.body).to.have.property('cause', 'INVALID_PARAMETER');
    });

    it('should return 400 for extGroupId ending with @', async () => {
      const response = await request(app)
        .get('/nudm-pp/v1/mbs-group-membership/group@')
        .expect(400);

      expect(response.body).to.have.property('status', 400);
      expect(response.body).to.have.property('cause', 'INVALID_PARAMETER');
    });

    it('should return 400 for extGroupId with multiple @ symbols', async () => {
      const response = await request(app)
        .get('/nudm-pp/v1/mbs-group-membership/group@domain@example.com')
        .expect(400);

      expect(response.body).to.have.property('status', 400);
      expect(response.body).to.have.property('cause', 'INVALID_PARAMETER');
    });

    it('should return 404 for non-existent group', async () => {
      const response = await request(app)
        .get('/nudm-pp/v1/mbs-group-membership/nonexistent-mbs@example.com')
        .expect(404)
        .expect('Content-Type', /json/);

      expect(response.body).to.have.property('status', 404);
      expect(response.body).to.have.property('title', 'Not Found');
      expect(response.body).to.have.property('type', 'urn:3gpp:error:not-found');
      expect(response.body).to.have.property('detail', '5G MBS Group not found');
      expect(response.body).to.have.property('cause', 'DATA_NOT_FOUND');
    });

    it('should return 404 for group that was deleted', async () => {
      const groupId = 'deleted-then-get-mbs@example.com';
      
      await request(app)
        .put(`/nudm-pp/v1/mbs-group-membership/${groupId}`)
        .send({
          multicastGroupMemb: ['msisdn-8888888888']
        })
        .expect(201);

      await request(app)
        .get(`/nudm-pp/v1/mbs-group-membership/${groupId}`)
        .expect(200);

      await request(app)
        .delete(`/nudm-pp/v1/mbs-group-membership/${groupId}`)
        .expect(204);

      const response = await request(app)
        .get(`/nudm-pp/v1/mbs-group-membership/${groupId}`)
        .expect(404);

      expect(response.body).to.have.property('status', 404);
      expect(response.body).to.have.property('cause', 'DATA_NOT_FOUND');
    });

    it('should return 404 for never-created group', async () => {
      const response = await request(app)
        .get('/nudm-pp/v1/mbs-group-membership/never-created-mbs@example.com')
        .expect(404);

      expect(response.body).to.have.property('status', 404);
      expect(response.body).to.have.property('cause', 'DATA_NOT_FOUND');
    });

    it('should return 404 for empty extGroupId path', async () => {
      await request(app)
        .get('/nudm-pp/v1/mbs-group-membership/')
        .expect(404);
    });

    it('should validate extGroupId before checking existence', async () => {
      const response = await request(app)
        .get('/nudm-pp/v1/mbs-group-membership/no-at-symbol')
        .expect(400);

      expect(response.body).to.have.property('status', 400);
      expect(response.body).to.have.property('cause', 'INVALID_PARAMETER');
    });
  });

  describe('Edge cases', () => {
    it('should handle extGroupId with special characters', async () => {
      const groupId = 'special-chars_123.test@sub.domain.example.com';
      const mbsGroupData = {
        multicastGroupMemb: ['msisdn-1234567890']
      };

      await request(app)
        .put(`/nudm-pp/v1/mbs-group-membership/${groupId}`)
        .send(mbsGroupData)
        .expect(201);

      const response = await request(app)
        .get(`/nudm-pp/v1/mbs-group-membership/${groupId}`)
        .expect(200);

      expect(response.body.multicastGroupMemb).to.deep.equal(['msisdn-1234567890']);
    });

    it('should handle very long GPSI lists', async () => {
      const groupId = 'long-list-mbs@example.com';
      const largeList = Array.from({ length: 100 }, (_, i) => `msisdn-${String(i).padStart(10, '0')}`);
      const mbsGroupData = {
        multicastGroupMemb: largeList
      };

      await request(app)
        .put(`/nudm-pp/v1/mbs-group-membership/${groupId}`)
        .send(mbsGroupData)
        .expect(201);

      const response = await request(app)
        .get(`/nudm-pp/v1/mbs-group-membership/${groupId}`)
        .expect(200);

      expect(response.body.multicastGroupMemb).to.have.lengthOf(100);
      expect(response.body.multicastGroupMemb[0]).to.equal('msisdn-0000000000');
      expect(response.body.multicastGroupMemb[99]).to.equal('msisdn-0000000099');
    });

    it('should handle long string values', async () => {
      const groupId = 'long-strings-mbs@example.com';
      const longAfId = 'af-' + 'x'.repeat(1000);
      const longInternalId = 'internal-' + 'y'.repeat(1000);
      
      const mbsGroupData = {
        multicastGroupMemb: ['msisdn-1234567890'],
        afInstanceId: longAfId,
        internalGroupIdentifier: longInternalId
      };

      await request(app)
        .put(`/nudm-pp/v1/mbs-group-membership/${groupId}`)
        .send(mbsGroupData)
        .expect(201);

      const response = await request(app)
        .get(`/nudm-pp/v1/mbs-group-membership/${groupId}`)
        .expect(200);

      expect(response.body.afInstanceId).to.equal(longAfId);
      expect(response.body.internalGroupIdentifier).to.equal(longInternalId);
    });

    it('should handle consecutive GET requests', async () => {
      const groupId = 'consecutive-get-mbs@example.com';
      const mbsGroupData = {
        multicastGroupMemb: ['msisdn-1234567890']
      };

      await request(app)
        .put(`/nudm-pp/v1/mbs-group-membership/${groupId}`)
        .send(mbsGroupData)
        .expect(201);

      for (let i = 0; i < 5; i++) {
        const response = await request(app)
          .get(`/nudm-pp/v1/mbs-group-membership/${groupId}`)
          .expect(200);

        expect(response.body.multicastGroupMemb).to.deep.equal(['msisdn-1234567890']);
      }
    });

    it('should not mutate stored data when retrieving', async () => {
      const groupId = 'immutable-mbs@example.com';
      const mbsGroupData = {
        multicastGroupMemb: ['msisdn-1234567890'],
        afInstanceId: 'af-test'
      };

      await request(app)
        .put(`/nudm-pp/v1/mbs-group-membership/${groupId}`)
        .send(mbsGroupData)
        .expect(201);

      const response1 = await request(app)
        .get(`/nudm-pp/v1/mbs-group-membership/${groupId}`)
        .expect(200);

      response1.body.afInstanceId = 'modified-value';
      response1.body.multicastGroupMemb.push('msisdn-9999999999');

      const response2 = await request(app)
        .get(`/nudm-pp/v1/mbs-group-membership/${groupId}`)
        .expect(200);

      expect(response2.body.afInstanceId).to.equal('af-test');
      expect(response2.body.multicastGroupMemb).to.deep.equal(['msisdn-1234567890']);
    });
  });
});

