import { expect } from 'chai';
import request from 'supertest';
import express from 'express';
import router from './nudm-sdm';

const app = express();
app.use(express.json());
app.use('/nudm-sdm/v1', router);

describe('GET /:supi', () => {
  const validSupi = 'imsi-999700000000001';
  const validNaiSupi = 'nai-user@example.com';
  const validGciSupi = 'gci-ABC123';
  const validGliSupi = 'gli-XYZ789';

  describe('Success cases - Single dataset', () => {
    it('should retrieve AM data for valid SUPI', async () => {
      const response = await request(app)
        .get(`/nudm-sdm/v1/${validSupi}`)
        .query({ 'dataset-names': 'AM' })
        .expect(200)
        .expect('Content-Type', /json/);

      expect(response.body).to.have.property('amData');
      expect(response.body.amData).to.have.property('gpsis');
      expect(response.body.amData).to.have.property('subscribedUeAmbr');
      expect(response.body.amData).to.have.property('nssai');
      expect(response.body.amData.subscribedUeAmbr).to.deep.equal({
        uplink: '1000 Mbps',
        downlink: '2000 Mbps'
      });
    });

    it('should retrieve SMF_SEL data for valid SUPI', async () => {
      const response = await request(app)
        .get(`/nudm-sdm/v1/${validSupi}`)
        .query({ 'dataset-names': 'SMF_SEL' })
        .expect(200)
        .expect('Content-Type', /json/);

      expect(response.body).to.have.property('smfSelData');
      expect(response.body.smfSelData).to.have.property('subscribedSnssaiInfos');
      expect(response.body).to.not.have.property('amData');
    });

    it('should retrieve SMS_SUB data for valid SUPI', async () => {
      const response = await request(app)
        .get(`/nudm-sdm/v1/${validSupi}`)
        .query({ 'dataset-names': 'SMS_SUB' })
        .expect(200)
        .expect('Content-Type', /json/);

      expect(response.body).to.have.property('smsSubsData');
      expect(response.body.smsSubsData).to.have.property('smsSubscribed', true);
      expect(response.body).to.not.have.property('amData');
    });

    it('should retrieve UEC_SMF data for valid SUPI', async () => {
      const response = await request(app)
        .get(`/nudm-sdm/v1/${validSupi}`)
        .query({ 'dataset-names': 'UEC_SMF' })
        .expect(200)
        .expect('Content-Type', /json/);

      expect(response.body).to.have.property('uecSmfData');
      expect(response.body).to.not.have.property('amData');
    });

    it('should retrieve UEC_SMSF data for valid SUPI', async () => {
      const response = await request(app)
        .get(`/nudm-sdm/v1/${validSupi}`)
        .query({ 'dataset-names': 'UEC_SMSF' })
        .expect(200)
        .expect('Content-Type', /json/);

      expect(response.body).to.have.property('uecSmsfData');
      expect(response.body).to.not.have.property('amData');
    });

    it('should retrieve SM data for valid SUPI', async () => {
      const response = await request(app)
        .get(`/nudm-sdm/v1/${validSupi}`)
        .query({ 'dataset-names': 'SM' })
        .expect(200)
        .expect('Content-Type', /json/);

      expect(response.body).to.have.property('smData');
      expect(response.body).to.not.have.property('amData');
    });

    it('should retrieve TRACE data for valid SUPI', async () => {
      const response = await request(app)
        .get(`/nudm-sdm/v1/${validSupi}`)
        .query({ 'dataset-names': 'TRACE' })
        .expect(200)
        .expect('Content-Type', /json/);

      expect(response.body).to.have.property('traceData');
      expect(response.body).to.not.have.property('amData');
    });

    it('should retrieve SMS_MNG data for valid SUPI', async () => {
      const response = await request(app)
        .get(`/nudm-sdm/v1/${validSupi}`)
        .query({ 'dataset-names': 'SMS_MNG' })
        .expect(200)
        .expect('Content-Type', /json/);

      expect(response.body).to.have.property('smsMngData');
      expect(response.body).to.not.have.property('amData');
    });

    it('should retrieve LCS_PRIVACY data for valid SUPI', async () => {
      const response = await request(app)
        .get(`/nudm-sdm/v1/${validSupi}`)
        .query({ 'dataset-names': 'LCS_PRIVACY' })
        .expect(200)
        .expect('Content-Type', /json/);

      expect(response.body).to.have.property('lcsPrivacyData');
      expect(response.body).to.not.have.property('amData');
    });

    it('should retrieve LCS_MO data for valid SUPI', async () => {
      const response = await request(app)
        .get(`/nudm-sdm/v1/${validSupi}`)
        .query({ 'dataset-names': 'LCS_MO' })
        .expect(200)
        .expect('Content-Type', /json/);

      expect(response.body).to.have.property('lcsMoData');
      expect(response.body).to.not.have.property('amData');
    });

    it('should retrieve UEC_AMF data for valid SUPI', async () => {
      const response = await request(app)
        .get(`/nudm-sdm/v1/${validSupi}`)
        .query({ 'dataset-names': 'UEC_AMF' })
        .expect(200)
        .expect('Content-Type', /json/);

      expect(response.body).to.have.property('uecAmfData');
      expect(response.body).to.not.have.property('amData');
    });

    it('should retrieve V2X data for valid SUPI', async () => {
      const response = await request(app)
        .get(`/nudm-sdm/v1/${validSupi}`)
        .query({ 'dataset-names': 'V2X' })
        .expect(200)
        .expect('Content-Type', /json/);

      expect(response.body).to.have.property('v2xData');
      expect(response.body).to.not.have.property('amData');
    });

    it('should retrieve LCS_BCA data for valid SUPI', async () => {
      const response = await request(app)
        .get(`/nudm-sdm/v1/${validSupi}`)
        .query({ 'dataset-names': 'LCS_BCA' })
        .expect(200)
        .expect('Content-Type', /json/);

      expect(response.body).to.have.property('lcsBroadcastAssistanceTypesData');
      expect(response.body).to.not.have.property('amData');
    });

    it('should retrieve PROSE data for valid SUPI', async () => {
      const response = await request(app)
        .get(`/nudm-sdm/v1/${validSupi}`)
        .query({ 'dataset-names': 'PROSE' })
        .expect(200)
        .expect('Content-Type', /json/);

      expect(response.body).to.have.property('proseData');
      expect(response.body).to.not.have.property('amData');
    });

    it('should retrieve UC data for valid SUPI', async () => {
      const response = await request(app)
        .get(`/nudm-sdm/v1/${validSupi}`)
        .query({ 'dataset-names': 'UC' })
        .expect(200)
        .expect('Content-Type', /json/);

      expect(response.body).to.have.property('ucData');
      expect(response.body).to.not.have.property('amData');
    });

    it('should retrieve MBS data for valid SUPI', async () => {
      const response = await request(app)
        .get(`/nudm-sdm/v1/${validSupi}`)
        .query({ 'dataset-names': 'MBS' })
        .expect(200)
        .expect('Content-Type', /json/);

      expect(response.body).to.have.property('mbsData');
      expect(response.body).to.not.have.property('amData');
    });
  });

  describe('Success cases - Multiple datasets', () => {
    it('should retrieve multiple datasets (AM, SMF_SEL) for valid SUPI', async () => {
      const response = await request(app)
        .get(`/nudm-sdm/v1/${validSupi}`)
        .query({ 'dataset-names': 'AM,SMF_SEL' })
        .expect(200)
        .expect('Content-Type', /json/);

      expect(response.body).to.have.property('amData');
      expect(response.body).to.have.property('smfSelData');
      expect(response.body).to.not.have.property('smsSubsData');
    });

    it('should retrieve three datasets (AM, SMF_SEL, SMS_SUB) for valid SUPI', async () => {
      const response = await request(app)
        .get(`/nudm-sdm/v1/${validSupi}`)
        .query({ 'dataset-names': 'AM,SMF_SEL,SMS_SUB' })
        .expect(200)
        .expect('Content-Type', /json/);

      expect(response.body).to.have.property('amData');
      expect(response.body).to.have.property('smfSelData');
      expect(response.body).to.have.property('smsSubsData');
      expect(response.body).to.not.have.property('smData');
    });

    it('should handle datasets with extra whitespace', async () => {
      const response = await request(app)
        .get(`/nudm-sdm/v1/${validSupi}`)
        .query({ 'dataset-names': 'AM , SMF_SEL , SMS_SUB' })
        .expect(200)
        .expect('Content-Type', /json/);

      expect(response.body).to.have.property('amData');
      expect(response.body).to.have.property('smfSelData');
      expect(response.body).to.have.property('smsSubsData');
    });

    it('should retrieve all core datasets at once', async () => {
      const response = await request(app)
        .get(`/nudm-sdm/v1/${validSupi}`)
        .query({ 'dataset-names': 'AM,SMF_SEL,UEC_SMF,UEC_SMSF,SMS_SUB,SM,TRACE,SMS_MNG' })
        .expect(200)
        .expect('Content-Type', /json/);

      expect(response.body).to.have.property('amData');
      expect(response.body).to.have.property('smfSelData');
      expect(response.body).to.have.property('uecSmfData');
      expect(response.body).to.have.property('uecSmsfData');
      expect(response.body).to.have.property('smsSubsData');
      expect(response.body).to.have.property('smData');
      expect(response.body).to.have.property('traceData');
      expect(response.body).to.have.property('smsMngData');
    });

    it('should retrieve all LCS-related datasets', async () => {
      const response = await request(app)
        .get(`/nudm-sdm/v1/${validSupi}`)
        .query({ 'dataset-names': 'LCS_PRIVACY,LCS_MO,LCS_BCA' })
        .expect(200)
        .expect('Content-Type', /json/);

      expect(response.body).to.have.property('lcsPrivacyData');
      expect(response.body).to.have.property('lcsMoData');
      expect(response.body).to.have.property('lcsBroadcastAssistanceTypesData');
      expect(response.body).to.not.have.property('amData');
    });

    it('should retrieve all UE context datasets', async () => {
      const response = await request(app)
        .get(`/nudm-sdm/v1/${validSupi}`)
        .query({ 'dataset-names': 'UEC_AMF,UEC_SMF,UEC_SMSF' })
        .expect(200)
        .expect('Content-Type', /json/);

      expect(response.body).to.have.property('uecAmfData');
      expect(response.body).to.have.property('uecSmfData');
      expect(response.body).to.have.property('uecSmsfData');
      expect(response.body).to.not.have.property('amData');
    });

    it('should retrieve all advanced feature datasets', async () => {
      const response = await request(app)
        .get(`/nudm-sdm/v1/${validSupi}`)
        .query({ 'dataset-names': 'V2X,PROSE,MBS,UC' })
        .expect(200)
        .expect('Content-Type', /json/);

      expect(response.body).to.have.property('v2xData');
      expect(response.body).to.have.property('proseData');
      expect(response.body).to.have.property('mbsData');
      expect(response.body).to.have.property('ucData');
      expect(response.body).to.not.have.property('amData');
    });

    it('should retrieve all available datasets at once', async () => {
      const allDatasets = 'AM,SMF_SEL,UEC_SMF,UEC_SMSF,SMS_SUB,SM,TRACE,SMS_MNG,LCS_PRIVACY,LCS_MO,UEC_AMF,V2X,LCS_BCA,PROSE,UC,MBS';

      const response = await request(app)
        .get(`/nudm-sdm/v1/${validSupi}`)
        .query({ 'dataset-names': allDatasets })
        .expect(200)
        .expect('Content-Type', /json/);

      // Verify all datasets are present
      expect(response.body).to.have.property('amData');
      expect(response.body).to.have.property('smfSelData');
      expect(response.body).to.have.property('uecSmfData');
      expect(response.body).to.have.property('uecSmsfData');
      expect(response.body).to.have.property('smsSubsData');
      expect(response.body).to.have.property('smData');
      expect(response.body).to.have.property('traceData');
      expect(response.body).to.have.property('smsMngData');
      expect(response.body).to.have.property('lcsPrivacyData');
      expect(response.body).to.have.property('lcsMoData');
      expect(response.body).to.have.property('uecAmfData');
      expect(response.body).to.have.property('v2xData');
      expect(response.body).to.have.property('lcsBroadcastAssistanceTypesData');
      expect(response.body).to.have.property('proseData');
      expect(response.body).to.have.property('ucData');
      expect(response.body).to.have.property('mbsData');
    });
  });

  describe('Success cases - Different SUPI formats', () => {
    it('should accept IMSI format SUPI', async () => {
      const response = await request(app)
        .get(`/nudm-sdm/v1/${validSupi}`)
        .query({ 'dataset-names': 'AM' })
        .expect(200);

      expect(response.body).to.have.property('amData');
    });

    it('should accept NAI format SUPI', async () => {
      const response = await request(app)
        .get(`/nudm-sdm/v1/${validNaiSupi}`)
        .query({ 'dataset-names': 'AM' })
        .expect(200);

      expect(response.body).to.have.property('amData');
    });

    it('should accept GCI format SUPI', async () => {
      const response = await request(app)
        .get(`/nudm-sdm/v1/${validGciSupi}`)
        .query({ 'dataset-names': 'AM' })
        .expect(200);

      expect(response.body).to.have.property('amData');
    });

    it('should accept GLI format SUPI', async () => {
      const response = await request(app)
        .get(`/nudm-sdm/v1/${validGliSupi}`)
        .query({ 'dataset-names': 'AM' })
        .expect(200);

      expect(response.body).to.have.property('amData');
    });
  });

  describe('Success cases - Data persistence', () => {
    it('should return same data for consecutive requests with same SUPI', async () => {
      const response1 = await request(app)
        .get(`/nudm-sdm/v1/${validSupi}`)
        .query({ 'dataset-names': 'AM' })
        .expect(200);

      const response2 = await request(app)
        .get(`/nudm-sdm/v1/${validSupi}`)
        .query({ 'dataset-names': 'AM' })
        .expect(200);

      expect(response1.body.amData).to.deep.equal(response2.body.amData);
    });

    it('should have consistent GPSI generation based on SUPI', async () => {
      const response = await request(app)
        .get(`/nudm-sdm/v1/${validSupi}`)
        .query({ 'dataset-names': 'AM' })
        .expect(200);

      const expectedGpsi = `msisdn-${validSupi.slice(-10)}`;
      expect(response.body.amData.gpsis).to.include(expectedGpsi);
    });
  });

  describe('Success cases - Optional query parameters', () => {
    it('should accept plmn-id query parameter', async () => {
      const response = await request(app)
        .get(`/nudm-sdm/v1/${validSupi}`)
        .query({
          'dataset-names': 'AM',
          'plmn-id': '999-70'
        })
        .expect(200);

      expect(response.body).to.have.property('amData');
    });

    it('should accept adjacent-plmns query parameter', async () => {
      const response = await request(app)
        .get(`/nudm-sdm/v1/${validSupi}`)
        .query({
          'dataset-names': 'AM',
          'adjacent-plmns': '999-71,999-72'
        })
        .expect(200);

      expect(response.body).to.have.property('amData');
    });

    it('should accept single-nssai query parameter', async () => {
      const response = await request(app)
        .get(`/nudm-sdm/v1/${validSupi}`)
        .query({
          'dataset-names': 'SM',
          'single-nssai': '{"sst":1,"sd":"000001"}'
        })
        .expect(200);

      expect(response.body).to.have.property('smData');
    });

    it('should accept dnn query parameter', async () => {
      const response = await request(app)
        .get(`/nudm-sdm/v1/${validSupi}`)
        .query({
          'dataset-names': 'SM',
          'dnn': 'internet'
        })
        .expect(200);

      expect(response.body).to.have.property('smData');
    });

    it('should accept uc-purpose query parameter', async () => {
      const response = await request(app)
        .get(`/nudm-sdm/v1/${validSupi}`)
        .query({
          'dataset-names': 'UC',
          'uc-purpose': 'FEE_CHARGING'
        })
        .expect(200);

      expect(response.body).to.have.property('ucData');
    });

    it('should accept disaster-roaming-ind query parameter', async () => {
      const response = await request(app)
        .get(`/nudm-sdm/v1/${validSupi}`)
        .query({
          'dataset-names': 'AM',
          'disaster-roaming-ind': 'true'
        })
        .expect(200);

      expect(response.body).to.have.property('amData');
    });

    it('should accept supported-features query parameter', async () => {
      const response = await request(app)
        .get(`/nudm-sdm/v1/${validSupi}`)
        .query({
          'dataset-names': 'AM',
          'supported-features': 'abc123'
        })
        .expect(200);

      expect(response.body).to.have.property('amData');
    });

    it('should accept multiple optional parameters together', async () => {
      const response = await request(app)
        .get(`/nudm-sdm/v1/${validSupi}`)
        .query({
          'dataset-names': 'AM,SMF_SEL',
          'plmn-id': '999-70',
          'disaster-roaming-ind': 'true',
          'supported-features': 'abc123'
        })
        .expect(200);

      expect(response.body).to.have.property('amData');
      expect(response.body).to.have.property('smfSelData');
    });
  });

  describe('Error cases - Invalid SUPI', () => {
    it('should reject invalid SUPI format', async () => {
      const response = await request(app)
        .get('/nudm-sdm/v1/invalid-supi-format')
        .query({ 'dataset-names': 'AM' })
        .expect(400)
        .expect('Content-Type', /json/);

      expect(response.body).to.have.property('title');
      expect(response.body).to.have.property('status', 400);
      expect(response.body).to.have.property('detail');
    });

    it('should reject SUPI with unsupported prefix', async () => {
      const response = await request(app)
        .get('/nudm-sdm/v1/msisdn-123456789')
        .query({ 'dataset-names': 'AM' })
        .expect(400);

      expect(response.body).to.have.property('status', 400);
    });

    it('should reject empty SUPI', async () => {
      const response = await request(app)
        .get('/nudm-sdm/v1/ ')
        .query({ 'dataset-names': 'AM' })
        .expect(400);

      expect(response.body).to.have.property('status', 400);
    });
  });

  describe('Error cases - Missing required parameters', () => {
    it('should reject request without dataset-names parameter', async () => {
      const response = await request(app)
        .get(`/nudm-sdm/v1/${validSupi}`)
        .expect(400)
        .expect('Content-Type', /json/);

      expect(response.body).to.have.property('title');
      expect(response.body).to.have.property('status', 400);
      expect(response.body).to.have.property('detail');
      expect(response.body.detail).to.include('dataset-names');
    });

    it('should reject request with empty dataset-names parameter', async () => {
      const response = await request(app)
        .get(`/nudm-sdm/v1/${validSupi}`)
        .query({ 'dataset-names': '' })
        .expect(400);

      expect(response.body).to.have.property('status', 400);
    });
  });

  describe('Error cases - Invalid dataset names', () => {
    it('should reject invalid dataset name', async () => {
      const response = await request(app)
        .get(`/nudm-sdm/v1/${validSupi}`)
        .query({ 'dataset-names': 'INVALID_DATASET' })
        .expect(400)
        .expect('Content-Type', /json/);

      expect(response.body).to.have.property('status', 400);
      expect(response.body).to.have.property('detail');
      expect(response.body.detail).to.include('INVALID_DATASET');
    });

    it('should reject when one of multiple datasets is invalid', async () => {
      const response = await request(app)
        .get(`/nudm-sdm/v1/${validSupi}`)
        .query({ 'dataset-names': 'AM,INVALID,SMF_SEL' })
        .expect(400);

      expect(response.body).to.have.property('status', 400);
      expect(response.body.detail).to.include('INVALID');
    });

    it('should reject lowercase dataset names', async () => {
      const response = await request(app)
        .get(`/nudm-sdm/v1/${validSupi}`)
        .query({ 'dataset-names': 'am' })
        .expect(400);

      expect(response.body).to.have.property('status', 400);
    });

    it('should reject dataset names with typos', async () => {
      const response = await request(app)
        .get(`/nudm-sdm/v1/${validSupi}`)
        .query({ 'dataset-names': 'AMM' })
        .expect(400);

      expect(response.body).to.have.property('status', 400);
    });
  });

  describe('Edge cases', () => {
    it('should handle very long SUPI', async () => {
      const longSupi = `imsi-${'9'.repeat(100)}`;
      const response = await request(app)
        .get(`/nudm-sdm/v1/${longSupi}`)
        .query({ 'dataset-names': 'AM' })
        .expect(200);

      expect(response.body).to.have.property('amData');
    });

    it('should handle duplicate dataset names in request', async () => {
      const response = await request(app)
        .get(`/nudm-sdm/v1/${validSupi}`)
        .query({ 'dataset-names': 'AM,AM,AM' })
        .expect(200);

      expect(response.body).to.have.property('amData');
      // Should only have amData, not duplicated
      const keys = Object.keys(response.body);
      expect(keys).to.have.lengthOf(1);
    });

    it('should handle datasets in different order', async () => {
      const response1 = await request(app)
        .get(`/nudm-sdm/v1/${validSupi}`)
        .query({ 'dataset-names': 'AM,SMF_SEL,SMS_SUB' })
        .expect(200);

      const response2 = await request(app)
        .get(`/nudm-sdm/v1/${validSupi}`)
        .query({ 'dataset-names': 'SMS_SUB,AM,SMF_SEL' })
        .expect(200);

      // Should have same properties regardless of order
      expect(Object.keys(response1.body).sort()).to.deep.equal(Object.keys(response2.body).sort());
    });

    it('should handle special characters in NAI SUPI', async () => {
      const specialNaiSupi = 'nai-user+test@example.com';
      const response = await request(app)
        .get(`/nudm-sdm/v1/${encodeURIComponent(specialNaiSupi)}`)
        .query({ 'dataset-names': 'AM' })
        .expect(200);

      expect(response.body).to.have.property('amData');
    });

    it('should handle different SUPIs independently', async () => {
      const supi1 = 'imsi-999700000000001';
      const supi2 = 'imsi-999700000000002';

      const response1 = await request(app)
        .get(`/nudm-sdm/v1/${supi1}`)
        .query({ 'dataset-names': 'AM' })
        .expect(200);

      const response2 = await request(app)
        .get(`/nudm-sdm/v1/${supi2}`)
        .query({ 'dataset-names': 'AM' })
        .expect(200);

      // Both should succeed but have different GPSIs
      expect(response1.body.amData.gpsis).to.not.deep.equal(response2.body.amData.gpsis);
    });
  });

  describe('Data structure validation', () => {
    it('should return properly structured AM data', async () => {
      const response = await request(app)
        .get(`/nudm-sdm/v1/${validSupi}`)
        .query({ 'dataset-names': 'AM' })
        .expect(200);

      const amData = response.body.amData;
      expect(amData).to.have.property('gpsis').that.is.an('array');
      expect(amData).to.have.property('subscribedUeAmbr').that.is.an('object');
      expect(amData.subscribedUeAmbr).to.have.property('uplink');
      expect(amData.subscribedUeAmbr).to.have.property('downlink');
      expect(amData).to.have.property('nssai').that.is.an('object');
      expect(amData.nssai).to.have.property('defaultSingleNssais').that.is.an('array');
      expect(amData.nssai).to.have.property('singleNssais').that.is.an('array');
    });

    it('should return properly structured SMF_SEL data', async () => {
      const response = await request(app)
        .get(`/nudm-sdm/v1/${validSupi}`)
        .query({ 'dataset-names': 'SMF_SEL' })
        .expect(200);

      const smfSelData = response.body.smfSelData;
      expect(smfSelData).to.have.property('subscribedSnssaiInfos').that.is.an('object');
      expect(smfSelData.subscribedSnssaiInfos).to.have.property('1-000001');
      expect(smfSelData.subscribedSnssaiInfos['1-000001']).to.have.property('dnnInfos').that.is.an('array');
    });

    it('should return valid NSSAI structure in AM data', async () => {
      const response = await request(app)
        .get(`/nudm-sdm/v1/${validSupi}`)
        .query({ 'dataset-names': 'AM' })
        .expect(200);

      const nssai = response.body.amData.nssai;
      const defaultNssai = nssai.defaultSingleNssais[0];

      expect(defaultNssai).to.have.property('sst').that.is.a('number');
      expect(defaultNssai).to.have.property('sd').that.is.a('string');
      expect(defaultNssai.sst).to.equal(1);
      expect(defaultNssai.sd).to.equal('000001');
    });
  });
});

describe('GET /:supi/nssai', () => {
  const validSupi = 'imsi-999700000000001';
  const validNaiSupi = 'nai-user@example.com';
  const validGciSupi = 'gci-ABC123';
  const validGliSupi = 'gli-XYZ789';

  describe('Success cases - Basic retrieval', () => {
    it('should retrieve NSSAI data for valid SUPI', async () => {
      const response = await request(app)
        .get(`/nudm-sdm/v1/${validSupi}/nssai`)
        .expect(200)
        .expect('Content-Type', /json/);

      expect(response.body).to.have.property('defaultSingleNssais');
      expect(response.body).to.have.property('singleNssais');
      expect(response.body.defaultSingleNssais).to.be.an('array');
      expect(response.body.singleNssais).to.be.an('array');
    });

    it('should return proper NSSAI structure with SST and SD', async () => {
      const response = await request(app)
        .get(`/nudm-sdm/v1/${validSupi}/nssai`)
        .expect(200);

      const defaultNssai = response.body.defaultSingleNssais[0];
      expect(defaultNssai).to.have.property('sst').that.is.a('number');
      expect(defaultNssai).to.have.property('sd').that.is.a('string');
      expect(defaultNssai.sst).to.equal(1);
      expect(defaultNssai.sd).to.equal('000001');
    });

    it('should return multiple single NSSAI entries', async () => {
      const response = await request(app)
        .get(`/nudm-sdm/v1/${validSupi}/nssai`)
        .expect(200);

      expect(response.body.singleNssais).to.have.length.at.least(1);
      const singleNssais = response.body.singleNssais;

      singleNssais.forEach((nssai: any) => {
        expect(nssai).to.have.property('sst');
        expect(nssai).to.have.property('sd');
      });
    });

    it('should include both default and single NSSAI arrays', async () => {
      const response = await request(app)
        .get(`/nudm-sdm/v1/${validSupi}/nssai`)
        .expect(200);

      expect(response.body.defaultSingleNssais).to.be.an('array').that.is.not.empty;
      expect(response.body.singleNssais).to.be.an('array').that.is.not.empty;
    });
  });

  describe('Success cases - Different SUPI formats', () => {
    it('should accept IMSI format SUPI', async () => {
      const response = await request(app)
        .get(`/nudm-sdm/v1/${validSupi}/nssai`)
        .expect(200);

      expect(response.body).to.have.property('defaultSingleNssais');
    });

    it('should accept NAI format SUPI', async () => {
      const response = await request(app)
        .get(`/nudm-sdm/v1/${validNaiSupi}/nssai`)
        .expect(200);

      expect(response.body).to.have.property('defaultSingleNssais');
    });

    it('should accept GCI format SUPI', async () => {
      const response = await request(app)
        .get(`/nudm-sdm/v1/${validGciSupi}/nssai`)
        .expect(200);

      expect(response.body).to.have.property('defaultSingleNssais');
    });

    it('should accept GLI format SUPI', async () => {
      const response = await request(app)
        .get(`/nudm-sdm/v1/${validGliSupi}/nssai`)
        .expect(200);

      expect(response.body).to.have.property('defaultSingleNssais');
    });
  });

  describe('Success cases - Optional query parameters', () => {
    it('should accept supported-features query parameter', async () => {
      const supportedFeatures = 'abc123';
      const response = await request(app)
        .get(`/nudm-sdm/v1/${validSupi}/nssai`)
        .query({ 'supported-features': supportedFeatures })
        .expect(200);

      expect(response.body).to.have.property('supportedFeatures', supportedFeatures);
      expect(response.body).to.have.property('defaultSingleNssais');
    });

    it('should accept plmn-id query parameter', async () => {
      const response = await request(app)
        .get(`/nudm-sdm/v1/${validSupi}/nssai`)
        .query({ 'plmn-id': '999-70' })
        .expect(200);

      expect(response.body).to.have.property('defaultSingleNssais');
    });

    it('should accept disaster-roaming-ind query parameter', async () => {
      const response = await request(app)
        .get(`/nudm-sdm/v1/${validSupi}/nssai`)
        .query({ 'disaster-roaming-ind': 'true' })
        .expect(200);

      expect(response.body).to.have.property('defaultSingleNssais');
    });

    it('should accept disaster-roaming-ind as false', async () => {
      const response = await request(app)
        .get(`/nudm-sdm/v1/${validSupi}/nssai`)
        .query({ 'disaster-roaming-ind': 'false' })
        .expect(200);

      expect(response.body).to.have.property('defaultSingleNssais');
    });

    it('should accept multiple optional parameters together', async () => {
      const supportedFeatures = 'xyz789';
      const response = await request(app)
        .get(`/nudm-sdm/v1/${validSupi}/nssai`)
        .query({
          'supported-features': supportedFeatures,
          'plmn-id': '999-70',
          'disaster-roaming-ind': 'true'
        })
        .expect(200);

      expect(response.body).to.have.property('supportedFeatures', supportedFeatures);
      expect(response.body).to.have.property('defaultSingleNssais');
    });

    it('should work without any query parameters', async () => {
      const response = await request(app)
        .get(`/nudm-sdm/v1/${validSupi}/nssai`)
        .expect(200);

      expect(response.body).to.have.property('defaultSingleNssais');
      expect(response.body).to.not.have.property('supportedFeatures');
    });
  });

  describe('Success cases - Data persistence', () => {
    it('should return same NSSAI data for consecutive requests with same SUPI', async () => {
      const response1 = await request(app)
        .get(`/nudm-sdm/v1/${validSupi}/nssai`)
        .expect(200);

      const response2 = await request(app)
        .get(`/nudm-sdm/v1/${validSupi}/nssai`)
        .expect(200);

      expect(response1.body).to.deep.equal(response2.body);
    });

    it('should maintain consistent NSSAI data across multiple calls', async () => {
      const supi = 'imsi-999700000000999';

      const response1 = await request(app)
        .get(`/nudm-sdm/v1/${supi}/nssai`)
        .expect(200);

      const response2 = await request(app)
        .get(`/nudm-sdm/v1/${supi}/nssai`)
        .expect(200);

      const response3 = await request(app)
        .get(`/nudm-sdm/v1/${supi}/nssai`)
        .expect(200);

      expect(response1.body.defaultSingleNssais).to.deep.equal(response2.body.defaultSingleNssais);
      expect(response2.body.defaultSingleNssais).to.deep.equal(response3.body.defaultSingleNssais);
      expect(response1.body.singleNssais).to.deep.equal(response2.body.singleNssais);
    });
  });

  describe('Error cases - Invalid SUPI', () => {
    it('should reject invalid SUPI format', async () => {
      const response = await request(app)
        .get('/nudm-sdm/v1/invalid-supi-format/nssai')
        .expect(400)
        .expect('Content-Type', /json/);

      expect(response.body).to.have.property('title');
      expect(response.body).to.have.property('status', 400);
      expect(response.body).to.have.property('detail');
    });

    it('should reject SUPI with unsupported prefix', async () => {
      const response = await request(app)
        .get('/nudm-sdm/v1/msisdn-123456789/nssai')
        .expect(400);

      expect(response.body).to.have.property('status', 400);
    });

    it('should reject empty SUPI', async () => {
      const response = await request(app)
        .get('/nudm-sdm/v1/ /nssai')
        .expect(400);

      expect(response.body).to.have.property('status', 400);
    });

    it('should reject SUPI without prefix', async () => {
      const response = await request(app)
        .get('/nudm-sdm/v1/999700000000001/nssai')
        .expect(400);

      expect(response.body).to.have.property('status', 400);
    });
  });

  describe('Data structure validation', () => {
    it('should return properly structured default NSSAI', async () => {
      const response = await request(app)
        .get(`/nudm-sdm/v1/${validSupi}/nssai`)
        .expect(200);

      const defaultNssais = response.body.defaultSingleNssais;
      expect(defaultNssais).to.be.an('array');
      expect(defaultNssais[0]).to.have.property('sst');
      expect(defaultNssais[0]).to.have.property('sd');
      expect(defaultNssais[0].sst).to.be.a('number');
      expect(defaultNssais[0].sd).to.be.a('string');
    });

    it('should return properly structured single NSSAI array', async () => {
      const response = await request(app)
        .get(`/nudm-sdm/v1/${validSupi}/nssai`)
        .expect(200);

      const singleNssais = response.body.singleNssais;
      expect(singleNssais).to.be.an('array');

      singleNssais.forEach((nssai: any) => {
        expect(nssai).to.have.property('sst').that.is.a('number');
        expect(nssai).to.have.property('sd').that.is.a('string');
      });
    });

    it('should include standard SST values', async () => {
      const response = await request(app)
        .get(`/nudm-sdm/v1/${validSupi}/nssai`)
        .expect(200);

      const allNssais = [
        ...response.body.defaultSingleNssais,
        ...response.body.singleNssais
      ];

      allNssais.forEach((nssai: any) => {
        expect(nssai.sst).to.be.within(1, 255);
      });
    });

    it('should have valid SD format (6 hex digits)', async () => {
      const response = await request(app)
        .get(`/nudm-sdm/v1/${validSupi}/nssai`)
        .expect(200);

      const allNssais = [
        ...response.body.defaultSingleNssais,
        ...response.body.singleNssais
      ];

      allNssais.forEach((nssai: any) => {
        expect(nssai.sd).to.match(/^[0-9A-Fa-f]{6}$/);
      });
    });

    it('should not include undefined or null values in response', async () => {
      const response = await request(app)
        .get(`/nudm-sdm/v1/${validSupi}/nssai`)
        .expect(200);

      expect(response.body.defaultSingleNssais).to.not.include(null);
      expect(response.body.defaultSingleNssais).to.not.include(undefined);
      expect(response.body.singleNssais).to.not.include(null);
      expect(response.body.singleNssais).to.not.include(undefined);
    });
  });

  describe('Edge cases', () => {
    it('should reject very long SUPI', async () => {
      const longSupi = `imsi-${'9'.repeat(100)}`;
      const response = await request(app)
        .get(`/nudm-sdm/v1/${longSupi}/nssai`)
        .expect(400);

      expect(response.body).to.have.property('status', 400);
    });

    it('should handle special characters in NAI SUPI', async () => {
      const specialNaiSupi = 'nai-user+test@example.com';
      const response = await request(app)
        .get(`/nudm-sdm/v1/${encodeURIComponent(specialNaiSupi)}/nssai`)
        .expect(200);

      expect(response.body).to.have.property('defaultSingleNssais');
    });

    it('should handle different SUPIs independently', async () => {
      const supi1 = 'imsi-999700000000001';
      const supi2 = 'imsi-999700000000002';

      const response1 = await request(app)
        .get(`/nudm-sdm/v1/${supi1}/nssai`)
        .expect(200);

      const response2 = await request(app)
        .get(`/nudm-sdm/v1/${supi2}/nssai`)
        .expect(200);

      // Both should succeed and have valid NSSAI data
      expect(response1.body).to.have.property('defaultSingleNssais');
      expect(response2.body).to.have.property('defaultSingleNssais');
    });

    it('should handle URL-encoded SUPI correctly', async () => {
      const naiSupi = 'nai-user@example.com';
      const response = await request(app)
        .get(`/nudm-sdm/v1/${encodeURIComponent(naiSupi)}/nssai`)
        .expect(200);

      expect(response.body).to.have.property('defaultSingleNssais');
      expect(response.body).to.have.property('singleNssais');
    });

    it('should handle empty supported-features parameter', async () => {
      const response = await request(app)
        .get(`/nudm-sdm/v1/${validSupi}/nssai`)
        .query({ 'supported-features': '' })
        .expect(200);

      expect(response.body).to.have.property('defaultSingleNssais');
      // Empty supported-features should not be included in response
      if (response.body.supportedFeatures !== undefined) {
        expect(response.body.supportedFeatures).to.equal('');
      }
    });
  });

  describe('Response format validation', () => {
    it('should return JSON content type', async () => {
      await request(app)
        .get(`/nudm-sdm/v1/${validSupi}/nssai`)
        .expect(200)
        .expect('Content-Type', /json/);
    });

    it('should not include extra fields beyond NSSAI spec', async () => {
      const response = await request(app)
        .get(`/nudm-sdm/v1/${validSupi}/nssai`)
        .expect(200);

      const validFields = [
        'defaultSingleNssais',
        'singleNssais',
        'supportedFeatures',
        'provisioningTime',
        'additionalSnssaiData',
        'suppressNssrgInd'
      ];

      Object.keys(response.body).forEach(key => {
        expect(validFields).to.include(key);
      });
    });

    it('should always include required fields', async () => {
      const response = await request(app)
        .get(`/nudm-sdm/v1/${validSupi}/nssai`)
        .expect(200);

      // defaultSingleNssais is required per 3GPP spec
      expect(response.body).to.have.property('defaultSingleNssais');
    });
  });
});

describe('GET /:supi/ue-context-in-amf-data', () => {
  const validSupi = 'imsi-999700000000001';
  const validNaiSupi = 'nai-user@example.com';
  const validGciSupi = 'gci-ABC123';
  const validGliSupi = 'gli-XYZ789';

  describe('Success cases - Basic retrieval', () => {
    it('should retrieve UE context in AMF data for valid SUPI', async () => {
      const response = await request(app)
        .get(`/nudm-sdm/v1/${validSupi}/ue-context-in-amf-data`)
        .expect(200)
        .expect('Content-Type', /json/);

      expect(response.body).to.have.property('amfInfo');
      expect(response.body.amfInfo).to.be.an('array');
      expect(response.body.amfInfo).to.have.length.at.least(1);
    });

    it('should return properly structured AMF info', async () => {
      const response = await request(app)
        .get(`/nudm-sdm/v1/${validSupi}/ue-context-in-amf-data`)
        .expect(200);

      const amfInfo = response.body.amfInfo[0];
      expect(amfInfo).to.have.property('amfInstanceId');
      expect(amfInfo).to.have.property('guami');
      expect(amfInfo).to.have.property('accessType');
      expect(amfInfo.amfInstanceId).to.be.a('string');
    });

    it('should return valid GUAMI structure', async () => {
      const response = await request(app)
        .get(`/nudm-sdm/v1/${validSupi}/ue-context-in-amf-data`)
        .expect(200);

      const guami = response.body.amfInfo[0].guami;
      expect(guami).to.have.property('plmnId');
      expect(guami).to.have.property('amfId');
      expect(guami.plmnId).to.have.property('mcc');
      expect(guami.plmnId).to.have.property('mnc');
      expect(guami.amfId).to.be.a('string');
    });

    it('should return valid accessType', async () => {
      const response = await request(app)
        .get(`/nudm-sdm/v1/${validSupi}/ue-context-in-amf-data`)
        .expect(200);

      const accessType = response.body.amfInfo[0].accessType;
      expect(accessType).to.be.oneOf(['3GPP_ACCESS', 'NON_3GPP_ACCESS']);
    });

    it('should include AMF instance ID based on SUPI', async () => {
      const response = await request(app)
        .get(`/nudm-sdm/v1/${validSupi}/ue-context-in-amf-data`)
        .expect(200);

      const amfInstanceId = response.body.amfInfo[0].amfInstanceId;
      expect(amfInstanceId).to.include('amf-instance-');
      expect(amfInstanceId).to.include(validSupi.slice(-8));
    });
  });

  describe('Success cases - Different SUPI formats', () => {
    it('should accept IMSI format SUPI', async () => {
      const response = await request(app)
        .get(`/nudm-sdm/v1/${validSupi}/ue-context-in-amf-data`)
        .expect(200);

      expect(response.body).to.have.property('amfInfo');
    });

    it('should accept NAI format SUPI', async () => {
      const response = await request(app)
        .get(`/nudm-sdm/v1/${validNaiSupi}/ue-context-in-amf-data`)
        .expect(200);

      expect(response.body).to.have.property('amfInfo');
    });

    it('should accept GCI format SUPI', async () => {
      const response = await request(app)
        .get(`/nudm-sdm/v1/${validGciSupi}/ue-context-in-amf-data`)
        .expect(200);

      expect(response.body).to.have.property('amfInfo');
    });

    it('should accept GLI format SUPI', async () => {
      const response = await request(app)
        .get(`/nudm-sdm/v1/${validGliSupi}/ue-context-in-amf-data`)
        .expect(200);

      expect(response.body).to.have.property('amfInfo');
    });
  });

  describe('Success cases - Optional query parameters', () => {
    it('should accept supported-features query parameter', async () => {
      const response = await request(app)
        .get(`/nudm-sdm/v1/${validSupi}/ue-context-in-amf-data`)
        .query({ 'supported-features': 'abc123' })
        .expect(200);

      expect(response.body).to.have.property('amfInfo');
    });
  });

  describe('Success cases - Data persistence', () => {
    it('should return same AMF data for consecutive requests with same SUPI', async () => {
      const response1 = await request(app)
        .get(`/nudm-sdm/v1/${validSupi}/ue-context-in-amf-data`)
        .expect(200);

      const response2 = await request(app)
        .get(`/nudm-sdm/v1/${validSupi}/ue-context-in-amf-data`)
        .expect(200);

      expect(response1.body).to.deep.equal(response2.body);
    });

    it('should maintain consistent AMF instance ID for same SUPI', async () => {
      const response1 = await request(app)
        .get(`/nudm-sdm/v1/${validSupi}/ue-context-in-amf-data`)
        .expect(200);

      const response2 = await request(app)
        .get(`/nudm-sdm/v1/${validSupi}/ue-context-in-amf-data`)
        .expect(200);

      expect(response1.body.amfInfo[0].amfInstanceId).to.equal(response2.body.amfInfo[0].amfInstanceId);
    });
  });

  describe('Error cases - Invalid SUPI', () => {
    it('should reject invalid SUPI format', async () => {
      const response = await request(app)
        .get('/nudm-sdm/v1/invalid-supi-format/ue-context-in-amf-data')
        .expect(400)
        .expect('Content-Type', /json/);

      expect(response.body).to.have.property('title');
      expect(response.body).to.have.property('status', 400);
      expect(response.body).to.have.property('detail');
    });

    it('should reject SUPI with unsupported prefix', async () => {
      const response = await request(app)
        .get('/nudm-sdm/v1/msisdn-123456789/ue-context-in-amf-data')
        .expect(400);

      expect(response.body).to.have.property('status', 400);
    });

    it('should reject empty SUPI', async () => {
      const response = await request(app)
        .get('/nudm-sdm/v1/ /ue-context-in-amf-data')
        .expect(400);

      expect(response.body).to.have.property('status', 400);
    });
  });

  describe('Edge cases', () => {
    it('should handle different SUPIs independently', async () => {
      const supi1 = 'imsi-999700000000001';
      const supi2 = 'imsi-999700000000002';

      const response1 = await request(app)
        .get(`/nudm-sdm/v1/${supi1}/ue-context-in-amf-data`)
        .expect(200);

      const response2 = await request(app)
        .get(`/nudm-sdm/v1/${supi2}/ue-context-in-amf-data`)
        .expect(200);

      expect(response1.body.amfInfo[0].amfInstanceId).to.not.equal(response2.body.amfInfo[0].amfInstanceId);
    });

    it('should handle special characters in NAI SUPI', async () => {
      const specialNaiSupi = 'nai-user+test@example.com';
      const response = await request(app)
        .get(`/nudm-sdm/v1/${encodeURIComponent(specialNaiSupi)}/ue-context-in-amf-data`)
        .expect(200);

      expect(response.body).to.have.property('amfInfo');
    });
  });

  describe('Data structure validation', () => {
    it('should return properly structured AMF context data', async () => {
      const response = await request(app)
        .get(`/nudm-sdm/v1/${validSupi}/ue-context-in-amf-data`)
        .expect(200);

      expect(response.body).to.be.an('object');
      expect(response.body.amfInfo).to.be.an('array');
      expect(response.body.amfInfo[0]).to.have.all.keys('amfInstanceId', 'guami', 'accessType');
    });

    it('should return JSON content type', async () => {
      await request(app)
        .get(`/nudm-sdm/v1/${validSupi}/ue-context-in-amf-data`)
        .expect(200)
        .expect('Content-Type', /json/);
    });
  });
});

describe('GET /:supi/ue-context-in-smf-data', () => {
  const validSupi = 'imsi-999700000000001';
  const validNaiSupi = 'nai-user@example.com';
  const validGciSupi = 'gci-ABC123';
  const validGliSupi = 'gli-XYZ789';

  describe('Success cases - Basic retrieval', () => {
    it('should retrieve UE context in SMF data for valid SUPI', async () => {
      const response = await request(app)
        .get(`/nudm-sdm/v1/${validSupi}/ue-context-in-smf-data`)
        .expect(200)
        .expect('Content-Type', /json/);

      expect(response.body).to.have.property('pduSessions');
      expect(response.body).to.have.property('pgwInfo');
    });

    it('should return properly structured PDU sessions', async () => {
      const response = await request(app)
        .get(`/nudm-sdm/v1/${validSupi}/ue-context-in-smf-data`)
        .expect(200);

      const pduSessions = response.body.pduSessions;
      expect(pduSessions).to.be.an('object');
      expect(pduSessions['1']).to.exist;
      expect(pduSessions['1']).to.have.property('dnn');
      expect(pduSessions['1']).to.have.property('smfInstanceId');
      expect(pduSessions['1']).to.have.property('plmnId');
      expect(pduSessions['1']).to.have.property('singleNssai');
    });

    it('should return valid PLMN ID in PDU session', async () => {
      const response = await request(app)
        .get(`/nudm-sdm/v1/${validSupi}/ue-context-in-smf-data`)
        .expect(200);

      const plmnId = response.body.pduSessions['1'].plmnId;
      expect(plmnId).to.have.property('mcc');
      expect(plmnId).to.have.property('mnc');
      expect(plmnId.mcc).to.be.a('string');
      expect(plmnId.mnc).to.be.a('string');
    });

    it('should return valid single NSSAI in PDU session', async () => {
      const response = await request(app)
        .get(`/nudm-sdm/v1/${validSupi}/ue-context-in-smf-data`)
        .expect(200);

      const singleNssai = response.body.pduSessions['1'].singleNssai;
      expect(singleNssai).to.have.property('sst');
      expect(singleNssai).to.have.property('sd');
      expect(singleNssai.sst).to.be.a('number');
      expect(singleNssai.sd).to.be.a('string');
    });

    it('should return properly structured PGW info', async () => {
      const response = await request(app)
        .get(`/nudm-sdm/v1/${validSupi}/ue-context-in-smf-data`)
        .expect(200);

      const pgwInfo = response.body.pgwInfo;
      expect(pgwInfo).to.be.an('array');
      expect(pgwInfo[0]).to.have.property('dnn');
      expect(pgwInfo[0]).to.have.property('pgwFqdn');
      expect(pgwInfo[0]).to.have.property('plmnId');
    });

    it('should include SMF instance ID based on SUPI', async () => {
      const response = await request(app)
        .get(`/nudm-sdm/v1/${validSupi}/ue-context-in-smf-data`)
        .expect(200);

      const smfInstanceId = response.body.pduSessions['1'].smfInstanceId;
      expect(smfInstanceId).to.include('smf-instance-');
      expect(smfInstanceId).to.include(validSupi.slice(-8));
    });

    it('should include valid PGW FQDN', async () => {
      const response = await request(app)
        .get(`/nudm-sdm/v1/${validSupi}/ue-context-in-smf-data`)
        .expect(200);

      const pgwFqdn = response.body.pgwInfo[0].pgwFqdn;
      expect(pgwFqdn).to.be.a('string');
      expect(pgwFqdn).to.include('pgw.');
      expect(pgwFqdn).to.include('.3gppnetwork.org');
    });
  });

  describe('Success cases - Different SUPI formats', () => {
    it('should accept IMSI format SUPI', async () => {
      const response = await request(app)
        .get(`/nudm-sdm/v1/${validSupi}/ue-context-in-smf-data`)
        .expect(200);

      expect(response.body).to.have.property('pduSessions');
    });

    it('should accept NAI format SUPI', async () => {
      const response = await request(app)
        .get(`/nudm-sdm/v1/${validNaiSupi}/ue-context-in-smf-data`)
        .expect(200);

      expect(response.body).to.have.property('pduSessions');
    });

    it('should accept GCI format SUPI', async () => {
      const response = await request(app)
        .get(`/nudm-sdm/v1/${validGciSupi}/ue-context-in-smf-data`)
        .expect(200);

      expect(response.body).to.have.property('pduSessions');
    });

    it('should accept GLI format SUPI', async () => {
      const response = await request(app)
        .get(`/nudm-sdm/v1/${validGliSupi}/ue-context-in-smf-data`)
        .expect(200);

      expect(response.body).to.have.property('pduSessions');
    });
  });

  describe('Success cases - Optional query parameters', () => {
    it('should accept supported-features query parameter', async () => {
      const response = await request(app)
        .get(`/nudm-sdm/v1/${validSupi}/ue-context-in-smf-data`)
        .query({ 'supported-features': 'abc123' })
        .expect(200);

      expect(response.body).to.have.property('pduSessions');
    });

    it('should accept plmn-id query parameter', async () => {
      const plmnId = JSON.stringify({ mcc: '999', mnc: '70' });
      // Use a unique SUPI to ensure fresh data with the provided PLMN ID
      const uniqueSupi = 'imsi-999700000099999';
      const response = await request(app)
        .get(`/nudm-sdm/v1/${uniqueSupi}/ue-context-in-smf-data`)
        .query({ 'plmn-id': plmnId })
        .expect(200);

      expect(response.body).to.have.property('pduSessions');
      // PLMN ID should be reflected in the response
      expect(response.body.pduSessions['1'].plmnId.mcc).to.equal('999');
      expect(response.body.pduSessions['1'].plmnId.mnc).to.equal('70');
    });

    it('should use default PLMN ID when not provided', async () => {
      const response = await request(app)
        .get(`/nudm-sdm/v1/${validSupi}/ue-context-in-smf-data`)
        .expect(200);

      expect(response.body.pduSessions['1'].plmnId).to.deep.equal({
        mcc: '001',
        mnc: '01'
      });
    });

    it('should accept both supported-features and plmn-id together', async () => {
      const plmnId = JSON.stringify({ mcc: '999', mnc: '71' });
      const response = await request(app)
        .get(`/nudm-sdm/v1/${validSupi}/ue-context-in-smf-data`)
        .query({
          'supported-features': 'xyz789',
          'plmn-id': plmnId
        })
        .expect(200);

      expect(response.body).to.have.property('pduSessions');
    });
  });

  describe('Success cases - Data persistence', () => {
    it('should return same SMF data for consecutive requests with same SUPI', async () => {
      const response1 = await request(app)
        .get(`/nudm-sdm/v1/${validSupi}/ue-context-in-smf-data`)
        .expect(200);

      const response2 = await request(app)
        .get(`/nudm-sdm/v1/${validSupi}/ue-context-in-smf-data`)
        .expect(200);

      expect(response1.body).to.deep.equal(response2.body);
    });

    it('should maintain consistent SMF instance ID for same SUPI', async () => {
      const response1 = await request(app)
        .get(`/nudm-sdm/v1/${validSupi}/ue-context-in-smf-data`)
        .expect(200);

      const response2 = await request(app)
        .get(`/nudm-sdm/v1/${validSupi}/ue-context-in-smf-data`)
        .expect(200);

      expect(response1.body.pduSessions['1'].smfInstanceId).to.equal(response2.body.pduSessions['1'].smfInstanceId);
    });
  });

  describe('Error cases - Invalid SUPI', () => {
    it('should reject invalid SUPI format', async () => {
      const response = await request(app)
        .get('/nudm-sdm/v1/invalid-supi-format/ue-context-in-smf-data')
        .expect(400)
        .expect('Content-Type', /json/);

      expect(response.body).to.have.property('title');
      expect(response.body).to.have.property('status', 400);
      expect(response.body).to.have.property('detail');
    });

    it('should reject SUPI with unsupported prefix', async () => {
      const response = await request(app)
        .get('/nudm-sdm/v1/msisdn-123456789/ue-context-in-smf-data')
        .expect(400);

      expect(response.body).to.have.property('status', 400);
    });

    it('should reject empty SUPI', async () => {
      const response = await request(app)
        .get('/nudm-sdm/v1/ /ue-context-in-smf-data')
        .expect(400);

      expect(response.body).to.have.property('status', 400);
    });
  });

  describe('Error cases - Invalid query parameters', () => {
    it('should reject invalid plmn-id JSON format', async () => {
      const response = await request(app)
        .get(`/nudm-sdm/v1/${validSupi}/ue-context-in-smf-data`)
        .query({ 'plmn-id': 'invalid-json' })
        .expect(400);

      expect(response.body).to.have.property('status', 400);
      expect(response.body.detail).to.include('plmn-id');
    });

    it('should reject plmn-id missing mcc', async () => {
      const plmnId = JSON.stringify({ mnc: '70' });
      const response = await request(app)
        .get(`/nudm-sdm/v1/${validSupi}/ue-context-in-smf-data`)
        .query({ 'plmn-id': plmnId })
        .expect(400);

      expect(response.body).to.have.property('status', 400);
    });

    it('should reject plmn-id missing mnc', async () => {
      const plmnId = JSON.stringify({ mcc: '999' });
      const response = await request(app)
        .get(`/nudm-sdm/v1/${validSupi}/ue-context-in-smf-data`)
        .query({ 'plmn-id': plmnId })
        .expect(400);

      expect(response.body).to.have.property('status', 400);
    });
  });

  describe('Edge cases', () => {
    it('should handle different SUPIs independently', async () => {
      const supi1 = 'imsi-999700000000001';
      const supi2 = 'imsi-999700000000002';

      const response1 = await request(app)
        .get(`/nudm-sdm/v1/${supi1}/ue-context-in-smf-data`)
        .expect(200);

      const response2 = await request(app)
        .get(`/nudm-sdm/v1/${supi2}/ue-context-in-smf-data`)
        .expect(200);

      expect(response1.body.pduSessions['1'].smfInstanceId).to.not.equal(response2.body.pduSessions['1'].smfInstanceId);
    });

    it('should handle special characters in NAI SUPI', async () => {
      const specialNaiSupi = 'nai-user+test@example.com';
      const response = await request(app)
        .get(`/nudm-sdm/v1/${encodeURIComponent(specialNaiSupi)}/ue-context-in-smf-data`)
        .expect(200);

      expect(response.body).to.have.property('pduSessions');
    });
  });

  describe('Data structure validation', () => {
    it('should return properly structured SMF context data', async () => {
      const response = await request(app)
        .get(`/nudm-sdm/v1/${validSupi}/ue-context-in-smf-data`)
        .expect(200);

      expect(response.body).to.be.an('object');
      expect(response.body.pduSessions).to.be.an('object');
      expect(response.body.pgwInfo).to.be.an('array');
    });

    it('should return JSON content type', async () => {
      await request(app)
        .get(`/nudm-sdm/v1/${validSupi}/ue-context-in-smf-data`)
        .expect(200)
        .expect('Content-Type', /json/);
    });

    it('should have valid DNN in PDU session', async () => {
      const response = await request(app)
        .get(`/nudm-sdm/v1/${validSupi}/ue-context-in-smf-data`)
        .expect(200);

      const dnn = response.body.pduSessions['1'].dnn;
      expect(dnn).to.be.a('string');
      expect(dnn).to.equal('internet');
    });
  });
});

describe('GET /:supi/ue-context-in-smsf-data', () => {
  const validSupi = 'imsi-999700000000001';
  const validNaiSupi = 'nai-user@example.com';
  const validGciSupi = 'gci-ABC123';
  const validGliSupi = 'gli-XYZ789';

  describe('Success cases - Basic retrieval', () => {
    it('should retrieve UE context in SMSF data for valid SUPI', async () => {
      const response = await request(app)
        .get(`/nudm-sdm/v1/${validSupi}/ue-context-in-smsf-data`)
        .expect(200)
        .expect('Content-Type', /json/);

      expect(response.body).to.have.property('smsfInfo3GppAccess');
      expect(response.body).to.have.property('smsfInfoNon3GppAccess');
    });

    it('should return properly structured 3GPP access SMSF info', async () => {
      const response = await request(app)
        .get(`/nudm-sdm/v1/${validSupi}/ue-context-in-smsf-data`)
        .expect(200);

      const smsfInfo3Gpp = response.body.smsfInfo3GppAccess;
      expect(smsfInfo3Gpp).to.have.property('smsfInstanceId');
      expect(smsfInfo3Gpp).to.have.property('plmnId');
      expect(smsfInfo3Gpp).to.have.property('smsfSetId');
      expect(smsfInfo3Gpp.smsfInstanceId).to.be.a('string');
    });

    it('should return properly structured Non-3GPP access SMSF info', async () => {
      const response = await request(app)
        .get(`/nudm-sdm/v1/${validSupi}/ue-context-in-smsf-data`)
        .expect(200);

      const smsfInfoNon3Gpp = response.body.smsfInfoNon3GppAccess;
      expect(smsfInfoNon3Gpp).to.have.property('smsfInstanceId');
      expect(smsfInfoNon3Gpp).to.have.property('plmnId');
      expect(smsfInfoNon3Gpp.smsfInstanceId).to.be.a('string');
    });

    it('should return valid PLMN ID in 3GPP access info', async () => {
      const response = await request(app)
        .get(`/nudm-sdm/v1/${validSupi}/ue-context-in-smsf-data`)
        .expect(200);

      const plmnId = response.body.smsfInfo3GppAccess.plmnId;
      expect(plmnId).to.have.property('mcc');
      expect(plmnId).to.have.property('mnc');
      expect(plmnId.mcc).to.be.a('string');
      expect(plmnId.mnc).to.be.a('string');
    });

    it('should return valid PLMN ID in Non-3GPP access info', async () => {
      const response = await request(app)
        .get(`/nudm-sdm/v1/${validSupi}/ue-context-in-smsf-data`)
        .expect(200);

      const plmnId = response.body.smsfInfoNon3GppAccess.plmnId;
      expect(plmnId).to.have.property('mcc');
      expect(plmnId).to.have.property('mnc');
      expect(plmnId.mcc).to.be.a('string');
      expect(plmnId.mnc).to.be.a('string');
    });

    it('should include SMSF instance IDs based on SUPI', async () => {
      const response = await request(app)
        .get(`/nudm-sdm/v1/${validSupi}/ue-context-in-smsf-data`)
        .expect(200);

      const smsfInstanceId3Gpp = response.body.smsfInfo3GppAccess.smsfInstanceId;
      const smsfInstanceIdNon3Gpp = response.body.smsfInfoNon3GppAccess.smsfInstanceId;

      expect(smsfInstanceId3Gpp).to.include('smsf-3gpp-instance-');
      expect(smsfInstanceId3Gpp).to.include(validSupi.slice(-8));
      expect(smsfInstanceIdNon3Gpp).to.include('smsf-non3gpp-instance-');
      expect(smsfInstanceIdNon3Gpp).to.include(validSupi.slice(-8));
    });

    it('should include SMSF set ID in 3GPP access info', async () => {
      const response = await request(app)
        .get(`/nudm-sdm/v1/${validSupi}/ue-context-in-smsf-data`)
        .expect(200);

      const smsfSetId = response.body.smsfInfo3GppAccess.smsfSetId;
      expect(smsfSetId).to.be.a('string');
      expect(smsfSetId).to.include('smsf-set-');
      expect(smsfSetId).to.include(validSupi.slice(-6));
    });

    it('should differentiate between 3GPP and Non-3GPP instance IDs', async () => {
      const response = await request(app)
        .get(`/nudm-sdm/v1/${validSupi}/ue-context-in-smsf-data`)
        .expect(200);

      const smsfInstanceId3Gpp = response.body.smsfInfo3GppAccess.smsfInstanceId;
      const smsfInstanceIdNon3Gpp = response.body.smsfInfoNon3GppAccess.smsfInstanceId;

      expect(smsfInstanceId3Gpp).to.not.equal(smsfInstanceIdNon3Gpp);
    });
  });

  describe('Success cases - Different SUPI formats', () => {
    it('should accept IMSI format SUPI', async () => {
      const response = await request(app)
        .get(`/nudm-sdm/v1/${validSupi}/ue-context-in-smsf-data`)
        .expect(200);

      expect(response.body).to.have.property('smsfInfo3GppAccess');
    });

    it('should accept NAI format SUPI', async () => {
      const response = await request(app)
        .get(`/nudm-sdm/v1/${validNaiSupi}/ue-context-in-smsf-data`)
        .expect(200);

      expect(response.body).to.have.property('smsfInfo3GppAccess');
    });

    it('should accept GCI format SUPI', async () => {
      const response = await request(app)
        .get(`/nudm-sdm/v1/${validGciSupi}/ue-context-in-smsf-data`)
        .expect(200);

      expect(response.body).to.have.property('smsfInfo3GppAccess');
    });

    it('should accept GLI format SUPI', async () => {
      const response = await request(app)
        .get(`/nudm-sdm/v1/${validGliSupi}/ue-context-in-smsf-data`)
        .expect(200);

      expect(response.body).to.have.property('smsfInfo3GppAccess');
    });
  });

  describe('Success cases - Optional query parameters', () => {
    it('should accept supported-features query parameter', async () => {
      const response = await request(app)
        .get(`/nudm-sdm/v1/${validSupi}/ue-context-in-smsf-data`)
        .query({ 'supported-features': 'abc123' })
        .expect(200);

      expect(response.body).to.have.property('smsfInfo3GppAccess');
    });
  });

  describe('Success cases - Data persistence', () => {
    it('should return same SMSF data for consecutive requests with same SUPI', async () => {
      const response1 = await request(app)
        .get(`/nudm-sdm/v1/${validSupi}/ue-context-in-smsf-data`)
        .expect(200);

      const response2 = await request(app)
        .get(`/nudm-sdm/v1/${validSupi}/ue-context-in-smsf-data`)
        .expect(200);

      expect(response1.body).to.deep.equal(response2.body);
    });

    it('should maintain consistent SMSF instance IDs for same SUPI', async () => {
      const response1 = await request(app)
        .get(`/nudm-sdm/v1/${validSupi}/ue-context-in-smsf-data`)
        .expect(200);

      const response2 = await request(app)
        .get(`/nudm-sdm/v1/${validSupi}/ue-context-in-smsf-data`)
        .expect(200);

      expect(response1.body.smsfInfo3GppAccess.smsfInstanceId).to.equal(response2.body.smsfInfo3GppAccess.smsfInstanceId);
      expect(response1.body.smsfInfoNon3GppAccess.smsfInstanceId).to.equal(response2.body.smsfInfoNon3GppAccess.smsfInstanceId);
    });
  });

  describe('Error cases - Invalid SUPI', () => {
    it('should reject invalid SUPI format', async () => {
      const response = await request(app)
        .get('/nudm-sdm/v1/invalid-supi-format/ue-context-in-smsf-data')
        .expect(400)
        .expect('Content-Type', /json/);

      expect(response.body).to.have.property('title');
      expect(response.body).to.have.property('status', 400);
      expect(response.body).to.have.property('detail');
    });

    it('should reject SUPI with unsupported prefix', async () => {
      const response = await request(app)
        .get('/nudm-sdm/v1/msisdn-123456789/ue-context-in-smsf-data')
        .expect(400);

      expect(response.body).to.have.property('status', 400);
    });

    it('should reject empty SUPI', async () => {
      const response = await request(app)
        .get('/nudm-sdm/v1/ /ue-context-in-smsf-data')
        .expect(400);

      expect(response.body).to.have.property('status', 400);
    });
  });

  describe('Edge cases', () => {
    it('should handle different SUPIs independently', async () => {
      const supi1 = 'imsi-999700000000001';
      const supi2 = 'imsi-999700000000002';

      const response1 = await request(app)
        .get(`/nudm-sdm/v1/${supi1}/ue-context-in-smsf-data`)
        .expect(200);

      const response2 = await request(app)
        .get(`/nudm-sdm/v1/${supi2}/ue-context-in-smsf-data`)
        .expect(200);

      expect(response1.body.smsfInfo3GppAccess.smsfInstanceId).to.not.equal(response2.body.smsfInfo3GppAccess.smsfInstanceId);
      expect(response1.body.smsfInfoNon3GppAccess.smsfInstanceId).to.not.equal(response2.body.smsfInfoNon3GppAccess.smsfInstanceId);
    });

    it('should handle special characters in NAI SUPI', async () => {
      const specialNaiSupi = 'nai-user+test@example.com';
      const response = await request(app)
        .get(`/nudm-sdm/v1/${encodeURIComponent(specialNaiSupi)}/ue-context-in-smsf-data`)
        .expect(200);

      expect(response.body).to.have.property('smsfInfo3GppAccess');
    });
  });

  describe('Data structure validation', () => {
    it('should return properly structured SMSF context data', async () => {
      const response = await request(app)
        .get(`/nudm-sdm/v1/${validSupi}/ue-context-in-smsf-data`)
        .expect(200);

      expect(response.body).to.be.an('object');
      expect(response.body.smsfInfo3GppAccess).to.be.an('object');
      expect(response.body.smsfInfoNon3GppAccess).to.be.an('object');
    });

    it('should return JSON content type', async () => {
      await request(app)
        .get(`/nudm-sdm/v1/${validSupi}/ue-context-in-smsf-data`)
        .expect(200)
        .expect('Content-Type', /json/);
    });

    it('should have all required fields in 3GPP access info', async () => {
      const response = await request(app)
        .get(`/nudm-sdm/v1/${validSupi}/ue-context-in-smsf-data`)
        .expect(200);

      const smsfInfo3Gpp = response.body.smsfInfo3GppAccess;
      expect(smsfInfo3Gpp).to.have.all.keys('smsfInstanceId', 'plmnId', 'smsfSetId');
    });

    it('should have all required fields in Non-3GPP access info', async () => {
      const response = await request(app)
        .get(`/nudm-sdm/v1/${validSupi}/ue-context-in-smsf-data`)
        .expect(200);

      const smsfInfoNon3Gpp = response.body.smsfInfoNon3GppAccess;
      expect(smsfInfoNon3Gpp).to.have.all.keys('smsfInstanceId', 'plmnId');
    });
  });
});

describe('GET /:supi/am-data', () => {
  const validSupi = 'imsi-999700000000001';
  const validNaiSupi = 'nai-user@example.com';
  const validGciSupi = 'gci-ABC123';
  const validGliSupi = 'gli-XYZ789';

  describe('Success cases - Basic retrieval', () => {
    it('should retrieve Access and Mobility data for valid SUPI', async () => {
      const response = await request(app)
        .get(`/nudm-sdm/v1/${validSupi}/am-data`)
        .expect(200)
        .expect('Content-Type', /json/);

      expect(response.body).to.have.property('gpsis');
      expect(response.body).to.have.property('subscribedUeAmbr');
      expect(response.body).to.have.property('nssai');
      expect(response.body.gpsis).to.be.an('array');
    });

    it('should return properly structured UE AMBR', async () => {
      const response = await request(app)
        .get(`/nudm-sdm/v1/${validSupi}/am-data`)
        .expect(200);

      const subscribedUeAmbr = response.body.subscribedUeAmbr;
      expect(subscribedUeAmbr).to.have.property('uplink');
      expect(subscribedUeAmbr).to.have.property('downlink');
      expect(subscribedUeAmbr.uplink).to.equal('1000 Mbps');
      expect(subscribedUeAmbr.downlink).to.equal('2000 Mbps');
    });

    it('should return properly structured NSSAI', async () => {
      const response = await request(app)
        .get(`/nudm-sdm/v1/${validSupi}/am-data`)
        .expect(200);

      const nssai = response.body.nssai;
      expect(nssai).to.have.property('defaultSingleNssais');
      expect(nssai).to.have.property('singleNssais');
      expect(nssai.defaultSingleNssais).to.be.an('array').with.length.at.least(1);
      expect(nssai.singleNssais).to.be.an('array').with.length.at.least(1);
    });

    it('should return GPSI array with MSISDN based on SUPI', async () => {
      const response = await request(app)
        .get(`/nudm-sdm/v1/${validSupi}/am-data`)
        .expect(200);

      const expectedGpsi = `msisdn-${validSupi.slice(-10)}`;
      expect(response.body.gpsis).to.include(expectedGpsi);
    });

    it('should return ratRestrictions array', async () => {
      const response = await request(app)
        .get(`/nudm-sdm/v1/${validSupi}/am-data`)
        .expect(200);

      expect(response.body).to.have.property('ratRestrictions');
      expect(response.body.ratRestrictions).to.be.an('array');
    });
  });

  describe('Success cases - Different SUPI formats', () => {
    it('should accept IMSI format SUPI', async () => {
      const response = await request(app)
        .get(`/nudm-sdm/v1/${validSupi}/am-data`)
        .expect(200);

      expect(response.body).to.have.property('gpsis');
    });

    it('should accept NAI format SUPI', async () => {
      const response = await request(app)
        .get(`/nudm-sdm/v1/${validNaiSupi}/am-data`)
        .expect(200);

      expect(response.body).to.have.property('gpsis');
    });

    it('should accept GCI format SUPI', async () => {
      const response = await request(app)
        .get(`/nudm-sdm/v1/${validGciSupi}/am-data`)
        .expect(200);

      expect(response.body).to.have.property('gpsis');
    });

    it('should accept GLI format SUPI', async () => {
      const response = await request(app)
        .get(`/nudm-sdm/v1/${validGliSupi}/am-data`)
        .expect(200);

      expect(response.body).to.have.property('gpsis');
    });
  });

  describe('Success cases - Optional query parameters', () => {
    it('should accept supported-features query parameter', async () => {
      const supportedFeatures = 'abc123';
      const response = await request(app)
        .get(`/nudm-sdm/v1/${validSupi}/am-data`)
        .query({ 'supported-features': supportedFeatures })
        .expect(200);

      expect(response.body).to.have.property('supportedFeatures', supportedFeatures);
      expect(response.body).to.have.property('gpsis');
    });

    it('should accept plmn-id query parameter', async () => {
      const plmnId = JSON.stringify({ mcc: '999', mnc: '70' });
      const response = await request(app)
        .get(`/nudm-sdm/v1/${validSupi}/am-data`)
        .query({ 'plmn-id': plmnId })
        .expect(200);

      expect(response.body).to.have.property('gpsis');
    });

    it('should accept adjacent-plmns query parameter', async () => {
      const adjacentPlmns = JSON.stringify([
        { mcc: '999', mnc: '71' },
        { mcc: '999', mnc: '72' }
      ]);
      const response = await request(app)
        .get(`/nudm-sdm/v1/${validSupi}/am-data`)
        .query({ 'adjacent-plmns': adjacentPlmns })
        .expect(200);

      expect(response.body).to.have.property('gpsis');
    });

    it('should accept disaster-roaming-ind query parameter', async () => {
      const response = await request(app)
        .get(`/nudm-sdm/v1/${validSupi}/am-data`)
        .query({ 'disaster-roaming-ind': 'true' })
        .expect(200);

      expect(response.body).to.have.property('gpsis');
    });

    it('should accept shared-data-ids query parameter', async () => {
      const response = await request(app)
        .get(`/nudm-sdm/v1/${validSupi}/am-data`)
        .query({ 'shared-data-ids': 'shared-123' })
        .expect(200);

      expect(response.body).to.have.property('gpsis');
    });

    it('should accept multiple optional parameters together', async () => {
      const supportedFeatures = 'xyz789';
      const plmnId = JSON.stringify({ mcc: '999', mnc: '70' });
      const response = await request(app)
        .get(`/nudm-sdm/v1/${validSupi}/am-data`)
        .query({
          'supported-features': supportedFeatures,
          'plmn-id': plmnId,
          'disaster-roaming-ind': 'true'
        })
        .expect(200);

      expect(response.body).to.have.property('supportedFeatures', supportedFeatures);
      expect(response.body).to.have.property('gpsis');
    });
  });

  describe('Success cases - Caching headers', () => {
    it('should return Cache-Control header', async () => {
      const response = await request(app)
        .get(`/nudm-sdm/v1/${validSupi}/am-data`)
        .expect(200);

      expect(response.headers).to.have.property('cache-control');
      expect(response.headers['cache-control']).to.include('max-age');
    });

    it('should return ETag header', async () => {
      const response = await request(app)
        .get(`/nudm-sdm/v1/${validSupi}/am-data`)
        .expect(200);

      expect(response.headers).to.have.property('etag');
      expect(response.headers['etag']).to.include(validSupi);
    });

    it('should return Last-Modified header', async () => {
      const response = await request(app)
        .get(`/nudm-sdm/v1/${validSupi}/am-data`)
        .expect(200);

      expect(response.headers).to.have.property('last-modified');
    });

    it('should have consistent ETag for same SUPI', async () => {
      const response1 = await request(app)
        .get(`/nudm-sdm/v1/${validSupi}/am-data`)
        .expect(200);

      const response2 = await request(app)
        .get(`/nudm-sdm/v1/${validSupi}/am-data`)
        .expect(200);

      expect(response1.headers['etag']).to.equal(response2.headers['etag']);
    });
  });

  describe('Success cases - Data persistence', () => {
    it('should return same AM data for consecutive requests with same SUPI', async () => {
      const response1 = await request(app)
        .get(`/nudm-sdm/v1/${validSupi}/am-data`)
        .expect(200);

      const response2 = await request(app)
        .get(`/nudm-sdm/v1/${validSupi}/am-data`)
        .expect(200);

      expect(response1.body.gpsis).to.deep.equal(response2.body.gpsis);
      expect(response1.body.subscribedUeAmbr).to.deep.equal(response2.body.subscribedUeAmbr);
      expect(response1.body.nssai).to.deep.equal(response2.body.nssai);
    });

    it('should maintain consistent GPSI generation based on SUPI', async () => {
      const response = await request(app)
        .get(`/nudm-sdm/v1/${validSupi}/am-data`)
        .expect(200);

      const expectedGpsi = `msisdn-${validSupi.slice(-10)}`;
      expect(response.body.gpsis).to.include(expectedGpsi);
    });
  });

  describe('Error cases - Invalid SUPI', () => {
    it('should reject invalid SUPI format', async () => {
      const response = await request(app)
        .get('/nudm-sdm/v1/invalid-supi-format/am-data')
        .expect(400)
        .expect('Content-Type', /json/);

      expect(response.body).to.have.property('title');
      expect(response.body).to.have.property('status', 400);
      expect(response.body).to.have.property('detail');
    });

    it('should reject SUPI with unsupported prefix', async () => {
      const response = await request(app)
        .get('/nudm-sdm/v1/msisdn-123456789/am-data')
        .expect(400);

      expect(response.body).to.have.property('status', 400);
    });

    it('should reject empty SUPI', async () => {
      const response = await request(app)
        .get('/nudm-sdm/v1/ /am-data')
        .expect(400);

      expect(response.body).to.have.property('status', 400);
    });
  });

  describe('Error cases - Invalid query parameters', () => {
    it('should reject invalid plmn-id JSON format', async () => {
      const response = await request(app)
        .get(`/nudm-sdm/v1/${validSupi}/am-data`)
        .query({ 'plmn-id': 'invalid-json' })
        .expect(400);

      expect(response.body).to.have.property('status', 400);
      expect(response.body.detail).to.include('plmn-id');
    });

    it('should reject plmn-id missing mcc', async () => {
      const plmnId = JSON.stringify({ mnc: '70' });
      const response = await request(app)
        .get(`/nudm-sdm/v1/${validSupi}/am-data`)
        .query({ 'plmn-id': plmnId })
        .expect(400);

      expect(response.body).to.have.property('status', 400);
    });

    it('should reject plmn-id missing mnc', async () => {
      const plmnId = JSON.stringify({ mcc: '999' });
      const response = await request(app)
        .get(`/nudm-sdm/v1/${validSupi}/am-data`)
        .query({ 'plmn-id': plmnId })
        .expect(400);

      expect(response.body).to.have.property('status', 400);
    });

    it('should reject invalid adjacent-plmns JSON format', async () => {
      const response = await request(app)
        .get(`/nudm-sdm/v1/${validSupi}/am-data`)
        .query({ 'adjacent-plmns': 'invalid-json' })
        .expect(400);

      expect(response.body).to.have.property('status', 400);
      expect(response.body.detail).to.include('adjacent-plmns');
    });

    it('should reject adjacent-plmns that is not an array', async () => {
      const adjacentPlmns = JSON.stringify({ mcc: '999', mnc: '70' });
      const response = await request(app)
        .get(`/nudm-sdm/v1/${validSupi}/am-data`)
        .query({ 'adjacent-plmns': adjacentPlmns })
        .expect(400);

      expect(response.body).to.have.property('status', 400);
    });

    it('should reject empty adjacent-plmns array', async () => {
      const adjacentPlmns = JSON.stringify([]);
      const response = await request(app)
        .get(`/nudm-sdm/v1/${validSupi}/am-data`)
        .query({ 'adjacent-plmns': adjacentPlmns })
        .expect(400);

      expect(response.body).to.have.property('status', 400);
    });
  });

  describe('Edge cases', () => {
    it('should handle different SUPIs independently', async () => {
      const supi1 = 'imsi-999700000000001';
      const supi2 = 'imsi-999700000000002';

      const response1 = await request(app)
        .get(`/nudm-sdm/v1/${supi1}/am-data`)
        .expect(200);

      const response2 = await request(app)
        .get(`/nudm-sdm/v1/${supi2}/am-data`)
        .expect(200);

      expect(response1.body.gpsis).to.not.deep.equal(response2.body.gpsis);
    });

    it('should handle special characters in NAI SUPI', async () => {
      const specialNaiSupi = 'nai-user+test@example.com';
      const response = await request(app)
        .get(`/nudm-sdm/v1/${encodeURIComponent(specialNaiSupi)}/am-data`)
        .expect(200);

      expect(response.body).to.have.property('gpsis');
    });
  });

  describe('Data structure validation', () => {
    it('should return properly structured AM subscription data', async () => {
      const response = await request(app)
        .get(`/nudm-sdm/v1/${validSupi}/am-data`)
        .expect(200);

      expect(response.body).to.be.an('object');
      expect(response.body.gpsis).to.be.an('array');
      expect(response.body.subscribedUeAmbr).to.be.an('object');
      expect(response.body.nssai).to.be.an('object');
      expect(response.body.ratRestrictions).to.be.an('array');
    });

    it('should return JSON content type', async () => {
      await request(app)
        .get(`/nudm-sdm/v1/${validSupi}/am-data`)
        .expect(200)
        .expect('Content-Type', /json/);
    });

    it('should have valid NSSAI structure', async () => {
      const response = await request(app)
        .get(`/nudm-sdm/v1/${validSupi}/am-data`)
        .expect(200);

      const nssai = response.body.nssai;
      const defaultNssai = nssai.defaultSingleNssais[0];

      expect(defaultNssai).to.have.property('sst').that.is.a('number');
      expect(defaultNssai).to.have.property('sd').that.is.a('string');
      expect(defaultNssai.sst).to.equal(1);
      expect(defaultNssai.sd).to.equal('000001');
    });
  });
});

describe('GET /:supi/smf-select-data', () => {
  const validSupi = 'imsi-999700000000001';
  const validNaiSupi = 'nai-user@example.com';
  const validGciSupi = 'gci-ABC123';
  const validGliSupi = 'gli-XYZ789';

  describe('Success cases - Basic retrieval', () => {
    it('should retrieve SMF Selection data for valid SUPI', async () => {
      const response = await request(app)
        .get(`/nudm-sdm/v1/${validSupi}/smf-select-data`)
        .expect(200)
        .expect('Content-Type', /json/);

      expect(response.body).to.have.property('subscribedSnssaiInfos');
      expect(response.body.subscribedSnssaiInfos).to.be.an('object');
    });

    it('should return properly structured subscribed SNSSAI infos', async () => {
      const response = await request(app)
        .get(`/nudm-sdm/v1/${validSupi}/smf-select-data`)
        .expect(200);

      const subscribedSnssaiInfos = response.body.subscribedSnssaiInfos;
      expect(subscribedSnssaiInfos).to.have.property('1-000001');
      expect(subscribedSnssaiInfos['1-000001']).to.have.property('dnnInfos');
      expect(subscribedSnssaiInfos['1-000001'].dnnInfos).to.be.an('array');
    });

    it('should return DNN information', async () => {
      const response = await request(app)
        .get(`/nudm-sdm/v1/${validSupi}/smf-select-data`)
        .expect(200);

      const dnnInfos = response.body.subscribedSnssaiInfos['1-000001'].dnnInfos;
      expect(dnnInfos).to.have.length.at.least(1);
      expect(dnnInfos[0]).to.have.property('dnn');
      expect(dnnInfos[0]).to.have.property('defaultDnnIndicator');
      expect(dnnInfos[0].dnn).to.equal('internet');
      expect(dnnInfos[0].defaultDnnIndicator).to.equal(true);
    });
  });

  describe('Success cases - Different SUPI formats', () => {
    it('should accept IMSI format SUPI', async () => {
      const response = await request(app)
        .get(`/nudm-sdm/v1/${validSupi}/smf-select-data`)
        .expect(200);

      expect(response.body).to.have.property('subscribedSnssaiInfos');
    });

    it('should accept NAI format SUPI', async () => {
      const response = await request(app)
        .get(`/nudm-sdm/v1/${validNaiSupi}/smf-select-data`)
        .expect(200);

      expect(response.body).to.have.property('subscribedSnssaiInfos');
    });

    it('should accept GCI format SUPI', async () => {
      const response = await request(app)
        .get(`/nudm-sdm/v1/${validGciSupi}/smf-select-data`)
        .expect(200);

      expect(response.body).to.have.property('subscribedSnssaiInfos');
    });

    it('should accept GLI format SUPI', async () => {
      const response = await request(app)
        .get(`/nudm-sdm/v1/${validGliSupi}/smf-select-data`)
        .expect(200);

      expect(response.body).to.have.property('subscribedSnssaiInfos');
    });
  });

  describe('Success cases - Optional query parameters', () => {
    it('should accept supported-features query parameter', async () => {
      const supportedFeatures = 'abc123';
      const response = await request(app)
        .get(`/nudm-sdm/v1/${validSupi}/smf-select-data`)
        .query({ 'supported-features': supportedFeatures })
        .expect(200);

      expect(response.body).to.have.property('supportedFeatures', supportedFeatures);
      expect(response.body).to.have.property('subscribedSnssaiInfos');
    });

    it('should accept plmn-id query parameter', async () => {
      const plmnId = JSON.stringify({ mcc: '999', mnc: '70' });
      const response = await request(app)
        .get(`/nudm-sdm/v1/${validSupi}/smf-select-data`)
        .query({ 'plmn-id': plmnId })
        .expect(200);

      expect(response.body).to.have.property('subscribedSnssaiInfos');
    });

    it('should accept disaster-roaming-ind query parameter', async () => {
      const response = await request(app)
        .get(`/nudm-sdm/v1/${validSupi}/smf-select-data`)
        .query({ 'disaster-roaming-ind': 'true' })
        .expect(200);

      expect(response.body).to.have.property('subscribedSnssaiInfos');
    });

    it('should accept multiple optional parameters together', async () => {
      const supportedFeatures = 'xyz789';
      const plmnId = JSON.stringify({ mcc: '999', mnc: '70' });
      const response = await request(app)
        .get(`/nudm-sdm/v1/${validSupi}/smf-select-data`)
        .query({
          'supported-features': supportedFeatures,
          'plmn-id': plmnId,
          'disaster-roaming-ind': 'false'
        })
        .expect(200);

      expect(response.body).to.have.property('supportedFeatures', supportedFeatures);
      expect(response.body).to.have.property('subscribedSnssaiInfos');
    });
  });

  describe('Success cases - Caching headers', () => {
    it('should return Cache-Control header', async () => {
      const response = await request(app)
        .get(`/nudm-sdm/v1/${validSupi}/smf-select-data`)
        .expect(200);

      expect(response.headers).to.have.property('cache-control');
      expect(response.headers['cache-control']).to.include('max-age');
    });

    it('should return ETag header', async () => {
      const response = await request(app)
        .get(`/nudm-sdm/v1/${validSupi}/smf-select-data`)
        .expect(200);

      expect(response.headers).to.have.property('etag');
      expect(response.headers['etag']).to.include(validSupi);
    });

    it('should return Last-Modified header', async () => {
      const response = await request(app)
        .get(`/nudm-sdm/v1/${validSupi}/smf-select-data`)
        .expect(200);

      expect(response.headers).to.have.property('last-modified');
    });
  });

  describe('Success cases - Data persistence', () => {
    it('should return same SMF selection data for consecutive requests', async () => {
      const response1 = await request(app)
        .get(`/nudm-sdm/v1/${validSupi}/smf-select-data`)
        .expect(200);

      const response2 = await request(app)
        .get(`/nudm-sdm/v1/${validSupi}/smf-select-data`)
        .expect(200);

      expect(response1.body).to.deep.equal(response2.body);
    });
  });

  describe('Error cases - Invalid SUPI', () => {
    it('should reject invalid SUPI format', async () => {
      const response = await request(app)
        .get('/nudm-sdm/v1/invalid-supi-format/smf-select-data')
        .expect(400)
        .expect('Content-Type', /json/);

      expect(response.body).to.have.property('title');
      expect(response.body).to.have.property('status', 400);
      expect(response.body).to.have.property('detail');
    });

    it('should reject SUPI with unsupported prefix', async () => {
      const response = await request(app)
        .get('/nudm-sdm/v1/msisdn-123456789/smf-select-data')
        .expect(400);

      expect(response.body).to.have.property('status', 400);
    });

    it('should reject empty SUPI', async () => {
      const response = await request(app)
        .get('/nudm-sdm/v1/ /smf-select-data')
        .expect(400);

      expect(response.body).to.have.property('status', 400);
    });
  });

  describe('Error cases - Invalid query parameters', () => {
    it('should reject invalid plmn-id JSON format', async () => {
      const response = await request(app)
        .get(`/nudm-sdm/v1/${validSupi}/smf-select-data`)
        .query({ 'plmn-id': 'invalid-json' })
        .expect(400);

      expect(response.body).to.have.property('status', 400);
      expect(response.body.detail).to.include('plmn-id');
    });

    it('should reject plmn-id missing mcc', async () => {
      const plmnId = JSON.stringify({ mnc: '70' });
      const response = await request(app)
        .get(`/nudm-sdm/v1/${validSupi}/smf-select-data`)
        .query({ 'plmn-id': plmnId })
        .expect(400);

      expect(response.body).to.have.property('status', 400);
    });

    it('should reject plmn-id missing mnc', async () => {
      const plmnId = JSON.stringify({ mcc: '999' });
      const response = await request(app)
        .get(`/nudm-sdm/v1/${validSupi}/smf-select-data`)
        .query({ 'plmn-id': plmnId })
        .expect(400);

      expect(response.body).to.have.property('status', 400);
    });
  });

  describe('Edge cases', () => {
    it('should handle different SUPIs independently', async () => {
      const supi1 = 'imsi-999700000000001';
      const supi2 = 'imsi-999700000000002';

      const response1 = await request(app)
        .get(`/nudm-sdm/v1/${supi1}/smf-select-data`)
        .expect(200);

      const response2 = await request(app)
        .get(`/nudm-sdm/v1/${supi2}/smf-select-data`)
        .expect(200);

      // Both should succeed
      expect(response1.body).to.have.property('subscribedSnssaiInfos');
      expect(response2.body).to.have.property('subscribedSnssaiInfos');
    });

    it('should handle special characters in NAI SUPI', async () => {
      const specialNaiSupi = 'nai-user+test@example.com';
      const response = await request(app)
        .get(`/nudm-sdm/v1/${encodeURIComponent(specialNaiSupi)}/smf-select-data`)
        .expect(200);

      expect(response.body).to.have.property('subscribedSnssaiInfos');
    });
  });

  describe('Data structure validation', () => {
    it('should return properly structured SMF selection data', async () => {
      const response = await request(app)
        .get(`/nudm-sdm/v1/${validSupi}/smf-select-data`)
        .expect(200);

      expect(response.body).to.be.an('object');
      expect(response.body.subscribedSnssaiInfos).to.be.an('object');
    });

    it('should return JSON content type', async () => {
      await request(app)
        .get(`/nudm-sdm/v1/${validSupi}/smf-select-data`)
        .expect(200)
        .expect('Content-Type', /json/);
    });
  });
});

describe('GET /:supi/sm-data', () => {
  const validSupi = 'imsi-999700000000001';
  const validNaiSupi = 'nai-user@example.com';
  const validGciSupi = 'gci-ABC123';
  const validGliSupi = 'gli-XYZ789';

  describe('Success cases - Basic retrieval', () => {
    it('should retrieve Session Management data for valid SUPI', async () => {
      const response = await request(app)
        .get(`/nudm-sdm/v1/${validSupi}/sm-data`)
        .expect(200)
        .expect('Content-Type', /json/);

      expect(response.body).to.have.property('singleNssai');
      expect(response.body).to.have.property('dnnConfigurations');
      expect(response.body.dnnConfigurations).to.be.an('object');
    });

    it('should return properly structured single NSSAI', async () => {
      const response = await request(app)
        .get(`/nudm-sdm/v1/${validSupi}/sm-data`)
        .expect(200);

      const singleNssai = response.body.singleNssai;
      expect(singleNssai).to.have.property('sst');
      expect(singleNssai).to.have.property('sd');
      expect(singleNssai.sst).to.be.a('number');
      expect(singleNssai.sd).to.be.a('string');
    });

    it('should return DNN configurations with internet DNN', async () => {
      const response = await request(app)
        .get(`/nudm-sdm/v1/${validSupi}/sm-data`)
        .expect(200);

      const dnnConfigurations = response.body.dnnConfigurations;
      expect(dnnConfigurations).to.have.property('internet');
      expect(dnnConfigurations.internet).to.have.property('pduSessionTypes');
      expect(dnnConfigurations.internet).to.have.property('sscModes');
    });

    it('should return PDU session types configuration', async () => {
      const response = await request(app)
        .get(`/nudm-sdm/v1/${validSupi}/sm-data`)
        .expect(200);

      const pduSessionTypes = response.body.dnnConfigurations.internet.pduSessionTypes;
      expect(pduSessionTypes).to.have.property('defaultSessionType');
      expect(pduSessionTypes).to.have.property('allowedSessionTypes');
      expect(pduSessionTypes.allowedSessionTypes).to.be.an('array');
    });

    it('should return SSC modes configuration', async () => {
      const response = await request(app)
        .get(`/nudm-sdm/v1/${validSupi}/sm-data`)
        .expect(200);

      const sscModes = response.body.dnnConfigurations.internet.sscModes;
      expect(sscModes).to.have.property('defaultSscMode');
      expect(sscModes).to.have.property('allowedSscModes');
      expect(sscModes.allowedSscModes).to.be.an('array');
    });

    it('should return 5G QoS profile', async () => {
      const response = await request(app)
        .get(`/nudm-sdm/v1/${validSupi}/sm-data`)
        .expect(200);

      const fiveGQosProfile = response.body.dnnConfigurations.internet.fiveGQosProfile;
      expect(fiveGQosProfile).to.have.property('fiveQi');
      expect(fiveGQosProfile).to.have.property('arp');
      expect(fiveGQosProfile.arp).to.have.property('priorityLevel');
      expect(fiveGQosProfile.arp).to.have.property('preemptCap');
      expect(fiveGQosProfile.arp).to.have.property('preemptVuln');
    });
  });

  describe('Success cases - Different SUPI formats', () => {
    it('should accept IMSI format SUPI', async () => {
      const response = await request(app)
        .get(`/nudm-sdm/v1/${validSupi}/sm-data`)
        .expect(200);

      expect(response.body).to.have.property('singleNssai');
    });

    it('should accept NAI format SUPI', async () => {
      const response = await request(app)
        .get(`/nudm-sdm/v1/${validNaiSupi}/sm-data`)
        .expect(200);

      expect(response.body).to.have.property('singleNssai');
    });

    it('should accept GCI format SUPI', async () => {
      const response = await request(app)
        .get(`/nudm-sdm/v1/${validGciSupi}/sm-data`)
        .expect(200);

      expect(response.body).to.have.property('singleNssai');
    });

    it('should accept GLI format SUPI', async () => {
      const response = await request(app)
        .get(`/nudm-sdm/v1/${validGliSupi}/sm-data`)
        .expect(200);

      expect(response.body).to.have.property('singleNssai');
    });
  });

  describe('Success cases - Optional query parameters', () => {
    it('should accept supported-features query parameter', async () => {
      const supportedFeatures = 'abc123';
      const response = await request(app)
        .get(`/nudm-sdm/v1/${validSupi}/sm-data`)
        .query({ 'supported-features': supportedFeatures })
        .expect(200);

      expect(response.body).to.have.property('supportedFeatures', supportedFeatures);
      expect(response.body).to.have.property('singleNssai');
    });

    it('should accept single-nssai query parameter', async () => {
      const singleNssai = JSON.stringify({ sst: 2, sd: '000002' });
      const response = await request(app)
        .get(`/nudm-sdm/v1/${validSupi}/sm-data`)
        .query({ 'single-nssai': singleNssai })
        .expect(200);

      expect(response.body).to.have.property('singleNssai');
      expect(response.body.singleNssai.sst).to.equal(2);
      expect(response.body.singleNssai.sd).to.equal('000002');
    });

    it('should accept dnn query parameter', async () => {
      const response = await request(app)
        .get(`/nudm-sdm/v1/${validSupi}/sm-data`)
        .query({ 'dnn': 'internet' })
        .expect(200);

      expect(response.body).to.have.property('singleNssai');
    });

    it('should accept plmn-id query parameter', async () => {
      const plmnId = JSON.stringify({ mcc: '999', mnc: '70' });
      const response = await request(app)
        .get(`/nudm-sdm/v1/${validSupi}/sm-data`)
        .query({ 'plmn-id': plmnId })
        .expect(200);

      expect(response.body).to.have.property('singleNssai');
    });

    it('should accept disaster-roaming-ind query parameter', async () => {
      const response = await request(app)
        .get(`/nudm-sdm/v1/${validSupi}/sm-data`)
        .query({ 'disaster-roaming-ind': 'true' })
        .expect(200);

      expect(response.body).to.have.property('singleNssai');
    });

    it('should accept multiple optional parameters together', async () => {
      const supportedFeatures = 'xyz789';
      const singleNssai = JSON.stringify({ sst: 1, sd: '000001' });
      const plmnId = JSON.stringify({ mcc: '999', mnc: '70' });
      const response = await request(app)
        .get(`/nudm-sdm/v1/${validSupi}/sm-data`)
        .query({
          'supported-features': supportedFeatures,
          'single-nssai': singleNssai,
          'dnn': 'internet',
          'plmn-id': plmnId
        })
        .expect(200);

      expect(response.body).to.have.property('supportedFeatures', supportedFeatures);
      expect(response.body).to.have.property('singleNssai');
    });
  });

  describe('Success cases - Caching headers', () => {
    it('should return Cache-Control header', async () => {
      const response = await request(app)
        .get(`/nudm-sdm/v1/${validSupi}/sm-data`)
        .expect(200);

      expect(response.headers).to.have.property('cache-control');
      expect(response.headers['cache-control']).to.include('max-age');
    });

    it('should return ETag header', async () => {
      const response = await request(app)
        .get(`/nudm-sdm/v1/${validSupi}/sm-data`)
        .expect(200);

      expect(response.headers).to.have.property('etag');
    });

    it('should return Last-Modified header', async () => {
      const response = await request(app)
        .get(`/nudm-sdm/v1/${validSupi}/sm-data`)
        .expect(200);

      expect(response.headers).to.have.property('last-modified');
    });
  });

  describe('Success cases - Data persistence', () => {
    it('should return same SM data for consecutive requests', async () => {
      const response1 = await request(app)
        .get(`/nudm-sdm/v1/${validSupi}/sm-data`)
        .expect(200);

      const response2 = await request(app)
        .get(`/nudm-sdm/v1/${validSupi}/sm-data`)
        .expect(200);

      expect(response1.body.singleNssai).to.deep.equal(response2.body.singleNssai);
      expect(response1.body.dnnConfigurations).to.deep.equal(response2.body.dnnConfigurations);
    });
  });

  describe('Error cases - Invalid SUPI', () => {
    it('should reject invalid SUPI format', async () => {
      const response = await request(app)
        .get('/nudm-sdm/v1/invalid-supi-format/sm-data')
        .expect(400)
        .expect('Content-Type', /json/);

      expect(response.body).to.have.property('title');
      expect(response.body).to.have.property('status', 400);
      expect(response.body).to.have.property('detail');
    });

    it('should reject SUPI with unsupported prefix', async () => {
      const response = await request(app)
        .get('/nudm-sdm/v1/msisdn-123456789/sm-data')
        .expect(400);

      expect(response.body).to.have.property('status', 400);
    });

    it('should reject empty SUPI', async () => {
      const response = await request(app)
        .get('/nudm-sdm/v1/ /sm-data')
        .expect(400);

      expect(response.body).to.have.property('status', 400);
    });
  });

  describe('Error cases - Invalid query parameters', () => {
    it('should reject invalid single-nssai JSON format', async () => {
      const response = await request(app)
        .get(`/nudm-sdm/v1/${validSupi}/sm-data`)
        .query({ 'single-nssai': 'invalid-json' })
        .expect(400);

      expect(response.body).to.have.property('status', 400);
      expect(response.body.detail).to.include('single-nssai');
    });

    it('should reject single-nssai missing sst', async () => {
      const singleNssai = JSON.stringify({ sd: '000001' });
      const response = await request(app)
        .get(`/nudm-sdm/v1/${validSupi}/sm-data`)
        .query({ 'single-nssai': singleNssai })
        .expect(400);

      expect(response.body).to.have.property('status', 400);
    });

    it('should reject invalid plmn-id JSON format', async () => {
      const response = await request(app)
        .get(`/nudm-sdm/v1/${validSupi}/sm-data`)
        .query({ 'plmn-id': 'invalid-json' })
        .expect(400);

      expect(response.body).to.have.property('status', 400);
      expect(response.body.detail).to.include('plmn-id');
    });

    it('should reject plmn-id missing mcc', async () => {
      const plmnId = JSON.stringify({ mnc: '70' });
      const response = await request(app)
        .get(`/nudm-sdm/v1/${validSupi}/sm-data`)
        .query({ 'plmn-id': plmnId })
        .expect(400);

      expect(response.body).to.have.property('status', 400);
    });

    it('should reject plmn-id missing mnc', async () => {
      const plmnId = JSON.stringify({ mcc: '999' });
      const response = await request(app)
        .get(`/nudm-sdm/v1/${validSupi}/sm-data`)
        .query({ 'plmn-id': plmnId })
        .expect(400);

      expect(response.body).to.have.property('status', 400);
    });
  });

  describe('Edge cases', () => {
    it('should handle different SUPIs independently', async () => {
      const supi1 = 'imsi-999700000000001';
      const supi2 = 'imsi-999700000000002';

      const response1 = await request(app)
        .get(`/nudm-sdm/v1/${supi1}/sm-data`)
        .expect(200);

      const response2 = await request(app)
        .get(`/nudm-sdm/v1/${supi2}/sm-data`)
        .expect(200);

      // Both should succeed
      expect(response1.body).to.have.property('singleNssai');
      expect(response2.body).to.have.property('singleNssai');
    });

    it('should handle special characters in NAI SUPI', async () => {
      const specialNaiSupi = 'nai-user+test@example.com';
      const response = await request(app)
        .get(`/nudm-sdm/v1/${encodeURIComponent(specialNaiSupi)}/sm-data`)
        .expect(200);

      expect(response.body).to.have.property('singleNssai');
    });
  });

  describe('Data structure validation', () => {
    it('should return properly structured Session Management data', async () => {
      const response = await request(app)
        .get(`/nudm-sdm/v1/${validSupi}/sm-data`)
        .expect(200);

      expect(response.body).to.be.an('object');
      expect(response.body.singleNssai).to.be.an('object');
      expect(response.body.dnnConfigurations).to.be.an('object');
    });

    it('should return JSON content type', async () => {
      await request(app)
        .get(`/nudm-sdm/v1/${validSupi}/sm-data`)
        .expect(200)
        .expect('Content-Type', /json/);
    });
  });
});

describe('GET /:supi/sms-data', () => {
  const validSupi = 'imsi-999700000000001';
  const validNaiSupi = 'nai-user@example.com';
  const validGciSupi = 'gci-ABC123';
  const validGliSupi = 'gli-XYZ789';

  describe('Success cases - Basic retrieval', () => {
    it('should retrieve SMS Subscription data for valid SUPI', async () => {
      const response = await request(app)
        .get(`/nudm-sdm/v1/${validSupi}/sms-data`)
        .expect(200)
        .expect('Content-Type', /json/);

      expect(response.body).to.have.property('smsSubscribed');
      expect(response.body.smsSubscribed).to.be.a('boolean');
    });

    it('should return smsSubscribed as true by default', async () => {
      const response = await request(app)
        .get(`/nudm-sdm/v1/${validSupi}/sms-data`)
        .expect(200);

      expect(response.body.smsSubscribed).to.equal(true);
    });
  });

  describe('Success cases - Different SUPI formats', () => {
    it('should accept IMSI format SUPI', async () => {
      const response = await request(app)
        .get(`/nudm-sdm/v1/${validSupi}/sms-data`)
        .expect(200);

      expect(response.body).to.have.property('smsSubscribed');
    });

    it('should accept NAI format SUPI', async () => {
      const response = await request(app)
        .get(`/nudm-sdm/v1/${validNaiSupi}/sms-data`)
        .expect(200);

      expect(response.body).to.have.property('smsSubscribed');
    });

    it('should accept GCI format SUPI', async () => {
      const response = await request(app)
        .get(`/nudm-sdm/v1/${validGciSupi}/sms-data`)
        .expect(200);

      expect(response.body).to.have.property('smsSubscribed');
    });

    it('should accept GLI format SUPI', async () => {
      const response = await request(app)
        .get(`/nudm-sdm/v1/${validGliSupi}/sms-data`)
        .expect(200);

      expect(response.body).to.have.property('smsSubscribed');
    });
  });

  describe('Success cases - Optional query parameters', () => {
    it('should accept supported-features query parameter', async () => {
      const supportedFeatures = 'abc123';
      const response = await request(app)
        .get(`/nudm-sdm/v1/${validSupi}/sms-data`)
        .query({ 'supported-features': supportedFeatures })
        .expect(200);

      expect(response.body).to.have.property('supportedFeatures', supportedFeatures);
      expect(response.body).to.have.property('smsSubscribed');
    });

    it('should accept plmn-id query parameter', async () => {
      const plmnId = JSON.stringify({ mcc: '999', mnc: '70' });
      const response = await request(app)
        .get(`/nudm-sdm/v1/${validSupi}/sms-data`)
        .query({ 'plmn-id': plmnId })
        .expect(200);

      expect(response.body).to.have.property('smsSubscribed');
    });

    it('should accept multiple optional parameters together', async () => {
      const supportedFeatures = 'xyz789';
      const plmnId = JSON.stringify({ mcc: '999', mnc: '70' });
      const response = await request(app)
        .get(`/nudm-sdm/v1/${validSupi}/sms-data`)
        .query({
          'supported-features': supportedFeatures,
          'plmn-id': plmnId
        })
        .expect(200);

      expect(response.body).to.have.property('supportedFeatures', supportedFeatures);
      expect(response.body).to.have.property('smsSubscribed');
    });
  });

  describe('Success cases - Caching headers', () => {
    it('should return Cache-Control header', async () => {
      const response = await request(app)
        .get(`/nudm-sdm/v1/${validSupi}/sms-data`)
        .expect(200);

      expect(response.headers).to.have.property('cache-control');
      expect(response.headers['cache-control']).to.include('max-age');
    });

    it('should return ETag header', async () => {
      const response = await request(app)
        .get(`/nudm-sdm/v1/${validSupi}/sms-data`)
        .expect(200);

      expect(response.headers).to.have.property('etag');
    });

    it('should return Last-Modified header', async () => {
      const response = await request(app)
        .get(`/nudm-sdm/v1/${validSupi}/sms-data`)
        .expect(200);

      expect(response.headers).to.have.property('last-modified');
    });
  });

  describe('Success cases - Data persistence', () => {
    it('should return same SMS data for consecutive requests', async () => {
      const response1 = await request(app)
        .get(`/nudm-sdm/v1/${validSupi}/sms-data`)
        .expect(200);

      const response2 = await request(app)
        .get(`/nudm-sdm/v1/${validSupi}/sms-data`)
        .expect(200);

      expect(response1.body).to.deep.equal(response2.body);
    });
  });

  describe('Error cases - Invalid SUPI', () => {
    it('should reject invalid SUPI format', async () => {
      const response = await request(app)
        .get('/nudm-sdm/v1/invalid-supi-format/sms-data')
        .expect(400)
        .expect('Content-Type', /json/);

      expect(response.body).to.have.property('title');
      expect(response.body).to.have.property('status', 400);
      expect(response.body).to.have.property('detail');
    });

    it('should reject SUPI with unsupported prefix', async () => {
      const response = await request(app)
        .get('/nudm-sdm/v1/msisdn-123456789/sms-data')
        .expect(400);

      expect(response.body).to.have.property('status', 400);
    });

    it('should reject empty SUPI', async () => {
      const response = await request(app)
        .get('/nudm-sdm/v1/ /sms-data')
        .expect(400);

      expect(response.body).to.have.property('status', 400);
    });
  });

  describe('Error cases - Invalid query parameters', () => {
    it('should reject invalid plmn-id JSON format', async () => {
      const response = await request(app)
        .get(`/nudm-sdm/v1/${validSupi}/sms-data`)
        .query({ 'plmn-id': 'invalid-json' })
        .expect(400);

      expect(response.body).to.have.property('status', 400);
      expect(response.body.detail).to.include('plmn-id');
    });

    it('should reject plmn-id missing mcc', async () => {
      const plmnId = JSON.stringify({ mnc: '70' });
      const response = await request(app)
        .get(`/nudm-sdm/v1/${validSupi}/sms-data`)
        .query({ 'plmn-id': plmnId })
        .expect(400);

      expect(response.body).to.have.property('status', 400);
    });

    it('should reject plmn-id missing mnc', async () => {
      const plmnId = JSON.stringify({ mcc: '999' });
      const response = await request(app)
        .get(`/nudm-sdm/v1/${validSupi}/sms-data`)
        .query({ 'plmn-id': plmnId })
        .expect(400);

      expect(response.body).to.have.property('status', 400);
    });
  });

  describe('Edge cases', () => {
    it('should handle different SUPIs independently', async () => {
      const supi1 = 'imsi-999700000000001';
      const supi2 = 'imsi-999700000000002';

      const response1 = await request(app)
        .get(`/nudm-sdm/v1/${supi1}/sms-data`)
        .expect(200);

      const response2 = await request(app)
        .get(`/nudm-sdm/v1/${supi2}/sms-data`)
        .expect(200);

      // Both should succeed
      expect(response1.body).to.have.property('smsSubscribed');
      expect(response2.body).to.have.property('smsSubscribed');
    });

    it('should handle special characters in NAI SUPI', async () => {
      const specialNaiSupi = 'nai-user+test@example.com';
      const response = await request(app)
        .get(`/nudm-sdm/v1/${encodeURIComponent(specialNaiSupi)}/sms-data`)
        .expect(200);

      expect(response.body).to.have.property('smsSubscribed');
    });
  });

  describe('Data structure validation', () => {
    it('should return properly structured SMS subscription data', async () => {
      const response = await request(app)
        .get(`/nudm-sdm/v1/${validSupi}/sms-data`)
        .expect(200);

      expect(response.body).to.be.an('object');
      expect(response.body.smsSubscribed).to.be.a('boolean');
    });

    it('should return JSON content type', async () => {
      await request(app)
        .get(`/nudm-sdm/v1/${validSupi}/sms-data`)
        .expect(200)
        .expect('Content-Type', /json/);
    });
  });
});

describe('GET /:supi/sms-mng-data', () => {
  const validSupi = 'imsi-999700000000001';
  const validNaiSupi = 'nai-user@example.com';
  const validGciSupi = 'gci-ABC123';
  const validGliSupi = 'gli-XYZ789';

  describe('Success cases - Basic retrieval', () => {
    it('should retrieve SMS Management data for valid SUPI', async () => {
      const response = await request(app)
        .get(`/nudm-sdm/v1/${validSupi}/sms-mng-data`)
        .expect(200)
        .expect('Content-Type', /json/);

      expect(response.body).to.have.property('mtSmsSubscribed');
      expect(response.body).to.have.property('mtSmsBarringAll');
      expect(response.body).to.have.property('mtSmsBarringRoaming');
      expect(response.body).to.have.property('moSmsSubscribed');
      expect(response.body).to.have.property('moSmsBarringAll');
      expect(response.body).to.have.property('moSmsBarringRoaming');
    });

    it('should return properly structured MT SMS data', async () => {
      const response = await request(app)
        .get(`/nudm-sdm/v1/${validSupi}/sms-mng-data`)
        .expect(200);

      expect(response.body.mtSmsSubscribed).to.be.a('boolean');
      expect(response.body.mtSmsBarringAll).to.be.a('boolean');
      expect(response.body.mtSmsBarringRoaming).to.be.a('boolean');
    });

    it('should return properly structured MO SMS data', async () => {
      const response = await request(app)
        .get(`/nudm-sdm/v1/${validSupi}/sms-mng-data`)
        .expect(200);

      expect(response.body.moSmsSubscribed).to.be.a('boolean');
      expect(response.body.moSmsBarringAll).to.be.a('boolean');
      expect(response.body.moSmsBarringRoaming).to.be.a('boolean');
    });

    it('should return default values for SMS management', async () => {
      const response = await request(app)
        .get(`/nudm-sdm/v1/${validSupi}/sms-mng-data`)
        .expect(200);

      expect(response.body.mtSmsSubscribed).to.equal(true);
      expect(response.body.mtSmsBarringAll).to.equal(false);
      expect(response.body.mtSmsBarringRoaming).to.equal(false);
      expect(response.body.moSmsSubscribed).to.equal(true);
      expect(response.body.moSmsBarringAll).to.equal(false);
      expect(response.body.moSmsBarringRoaming).to.equal(false);
    });

    it('should have MT and MO SMS subscribed by default', async () => {
      const response = await request(app)
        .get(`/nudm-sdm/v1/${validSupi}/sms-mng-data`)
        .expect(200);

      expect(response.body.mtSmsSubscribed).to.equal(true);
      expect(response.body.moSmsSubscribed).to.equal(true);
    });

    it('should have all barring options disabled by default', async () => {
      const response = await request(app)
        .get(`/nudm-sdm/v1/${validSupi}/sms-mng-data`)
        .expect(200);

      expect(response.body.mtSmsBarringAll).to.equal(false);
      expect(response.body.mtSmsBarringRoaming).to.equal(false);
      expect(response.body.moSmsBarringAll).to.equal(false);
      expect(response.body.moSmsBarringRoaming).to.equal(false);
    });
  });

  describe('Success cases - Different SUPI formats', () => {
    it('should accept IMSI format SUPI', async () => {
      const response = await request(app)
        .get(`/nudm-sdm/v1/${validSupi}/sms-mng-data`)
        .expect(200);

      expect(response.body).to.have.property('mtSmsSubscribed');
    });

    it('should accept NAI format SUPI', async () => {
      const response = await request(app)
        .get(`/nudm-sdm/v1/${validNaiSupi}/sms-mng-data`)
        .expect(200);

      expect(response.body).to.have.property('mtSmsSubscribed');
    });

    it('should accept GCI format SUPI', async () => {
      const response = await request(app)
        .get(`/nudm-sdm/v1/${validGciSupi}/sms-mng-data`)
        .expect(200);

      expect(response.body).to.have.property('mtSmsSubscribed');
    });

    it('should accept GLI format SUPI', async () => {
      const response = await request(app)
        .get(`/nudm-sdm/v1/${validGliSupi}/sms-mng-data`)
        .expect(200);

      expect(response.body).to.have.property('mtSmsSubscribed');
    });
  });

  describe('Success cases - Optional query parameters', () => {
    it('should accept supported-features query parameter', async () => {
      const supportedFeatures = 'abc123';
      const response = await request(app)
        .get(`/nudm-sdm/v1/${validSupi}/sms-mng-data`)
        .query({ 'supported-features': supportedFeatures })
        .expect(200);

      expect(response.body).to.have.property('supportedFeatures', supportedFeatures);
      expect(response.body).to.have.property('mtSmsSubscribed');
    });

    it('should accept plmn-id query parameter', async () => {
      const plmnId = JSON.stringify({ mcc: '999', mnc: '70' });
      const response = await request(app)
        .get(`/nudm-sdm/v1/${validSupi}/sms-mng-data`)
        .query({ 'plmn-id': plmnId })
        .expect(200);

      expect(response.body).to.have.property('mtSmsSubscribed');
    });

    it('should accept multiple optional parameters together', async () => {
      const supportedFeatures = 'xyz789';
      const plmnId = JSON.stringify({ mcc: '999', mnc: '70' });
      const response = await request(app)
        .get(`/nudm-sdm/v1/${validSupi}/sms-mng-data`)
        .query({
          'supported-features': supportedFeatures,
          'plmn-id': plmnId
        })
        .expect(200);

      expect(response.body).to.have.property('supportedFeatures', supportedFeatures);
      expect(response.body).to.have.property('mtSmsSubscribed');
    });
  });

  describe('Success cases - Caching headers', () => {
    it('should return Cache-Control header', async () => {
      const response = await request(app)
        .get(`/nudm-sdm/v1/${validSupi}/sms-mng-data`)
        .expect(200);

      expect(response.headers).to.have.property('cache-control');
      expect(response.headers['cache-control']).to.include('max-age');
    });

    it('should return ETag header', async () => {
      const response = await request(app)
        .get(`/nudm-sdm/v1/${validSupi}/sms-mng-data`)
        .expect(200);

      expect(response.headers).to.have.property('etag');
    });

    it('should return Last-Modified header', async () => {
      const response = await request(app)
        .get(`/nudm-sdm/v1/${validSupi}/sms-mng-data`)
        .expect(200);

      expect(response.headers).to.have.property('last-modified');
    });
  });

  describe('Success cases - Data persistence', () => {
    it('should return same SMS management data for consecutive requests', async () => {
      const response1 = await request(app)
        .get(`/nudm-sdm/v1/${validSupi}/sms-mng-data`)
        .expect(200);

      const response2 = await request(app)
        .get(`/nudm-sdm/v1/${validSupi}/sms-mng-data`)
        .expect(200);

      expect(response1.body).to.deep.equal(response2.body);
    });
  });

  describe('Error cases - Invalid SUPI', () => {
    it('should reject invalid SUPI format', async () => {
      const response = await request(app)
        .get('/nudm-sdm/v1/invalid-supi-format/sms-mng-data')
        .expect(400)
        .expect('Content-Type', /json/);

      expect(response.body).to.have.property('title');
      expect(response.body).to.have.property('status', 400);
      expect(response.body).to.have.property('detail');
    });

    it('should reject SUPI with unsupported prefix', async () => {
      const response = await request(app)
        .get('/nudm-sdm/v1/msisdn-123456789/sms-mng-data')
        .expect(400);

      expect(response.body).to.have.property('status', 400);
    });

    it('should reject empty SUPI', async () => {
      const response = await request(app)
        .get('/nudm-sdm/v1/ /sms-mng-data')
        .expect(400);

      expect(response.body).to.have.property('status', 400);
    });
  });

  describe('Error cases - Invalid query parameters', () => {
    it('should reject invalid plmn-id JSON format', async () => {
      const response = await request(app)
        .get(`/nudm-sdm/v1/${validSupi}/sms-mng-data`)
        .query({ 'plmn-id': 'invalid-json' })
        .expect(400);

      expect(response.body).to.have.property('status', 400);
      expect(response.body.detail).to.include('plmn-id');
    });

    it('should reject plmn-id missing mcc', async () => {
      const plmnId = JSON.stringify({ mnc: '70' });
      const response = await request(app)
        .get(`/nudm-sdm/v1/${validSupi}/sms-mng-data`)
        .query({ 'plmn-id': plmnId })
        .expect(400);

      expect(response.body).to.have.property('status', 400);
    });

    it('should reject plmn-id missing mnc', async () => {
      const plmnId = JSON.stringify({ mcc: '999' });
      const response = await request(app)
        .get(`/nudm-sdm/v1/${validSupi}/sms-mng-data`)
        .query({ 'plmn-id': plmnId })
        .expect(400);

      expect(response.body).to.have.property('status', 400);
    });
  });

  describe('Edge cases', () => {
    it('should handle different SUPIs independently', async () => {
      const supi1 = 'imsi-999700000000001';
      const supi2 = 'imsi-999700000000002';

      const response1 = await request(app)
        .get(`/nudm-sdm/v1/${supi1}/sms-mng-data`)
        .expect(200);

      const response2 = await request(app)
        .get(`/nudm-sdm/v1/${supi2}/sms-mng-data`)
        .expect(200);

      // Both should succeed
      expect(response1.body).to.have.property('mtSmsSubscribed');
      expect(response2.body).to.have.property('mtSmsSubscribed');
    });

    it('should handle special characters in NAI SUPI', async () => {
      const specialNaiSupi = 'nai-user+test@example.com';
      const response = await request(app)
        .get(`/nudm-sdm/v1/${encodeURIComponent(specialNaiSupi)}/sms-mng-data`)
        .expect(200);

      expect(response.body).to.have.property('mtSmsSubscribed');
    });
  });

  describe('Data structure validation', () => {
    it('should return properly structured SMS management data', async () => {
      const response = await request(app)
        .get(`/nudm-sdm/v1/${validSupi}/sms-mng-data`)
        .expect(200);

      expect(response.body).to.be.an('object');
      expect(response.body.mtSmsSubscribed).to.be.a('boolean');
      expect(response.body.mtSmsBarringAll).to.be.a('boolean');
      expect(response.body.mtSmsBarringRoaming).to.be.a('boolean');
      expect(response.body.moSmsSubscribed).to.be.a('boolean');
      expect(response.body.moSmsBarringAll).to.be.a('boolean');
      expect(response.body.moSmsBarringRoaming).to.be.a('boolean');
    });

    it('should return JSON content type', async () => {
      await request(app)
        .get(`/nudm-sdm/v1/${validSupi}/sms-mng-data`)
        .expect(200)
        .expect('Content-Type', /json/);
    });

    it('should have exactly 6 core boolean fields', async () => {
      const response = await request(app)
        .get(`/nudm-sdm/v1/${validSupi}/sms-mng-data`)
        .expect(200);

      const coreFields = [
        'mtSmsSubscribed',
        'mtSmsBarringAll',
        'mtSmsBarringRoaming',
        'moSmsSubscribed',
        'moSmsBarringAll',
        'moSmsBarringRoaming'
      ];

      coreFields.forEach(field => {
        expect(response.body).to.have.property(field);
        expect(response.body[field]).to.be.a('boolean');
      });
    });
  });
});

describe('GET /:ueId/lcs-privacy-data', () => {
  const validUeId = 'imsi-999700000000001';
  const validNaiUeId = 'nai-user@example.com';
  const validGciUeId = 'gci-ABC123';
  const validGliUeId = 'gli-XYZ789';
  const validMsisdnUeId = 'msisdn-1234567890';
  const validExtidUeId = 'extid-user@example.com';

  describe('Success cases', () => {
    it('should retrieve LCS privacy data for valid IMSI ueId', async () => {
      const response = await request(app)
        .get(`/nudm-sdm/v1/${validUeId}/lcs-privacy-data`)
        .expect(200)
        .expect('Content-Type', /json/);

      expect(response.body).to.have.property('lpi');
      expect(response.body.lpi).to.have.property('locationPrivacyInd');
      expect(response.body.lpi).to.have.property('validTimePeriod');
      expect(response.body).to.have.property('unrelatedClass');
      expect(response.body).to.have.property('plmnOperatorClasses');
      expect(response.body.plmnOperatorClasses).to.be.an('array');
    });

    it('should retrieve LCS privacy data for NAI ueId format', async () => {
      const response = await request(app)
        .get(`/nudm-sdm/v1/${encodeURIComponent(validNaiUeId)}/lcs-privacy-data`)
        .expect(200);

      expect(response.body).to.have.property('lpi');
      expect(response.body).to.have.property('unrelatedClass');
    });

    it('should retrieve LCS privacy data for GCI ueId format', async () => {
      const response = await request(app)
        .get(`/nudm-sdm/v1/${validGciUeId}/lcs-privacy-data`)
        .expect(200);

      expect(response.body).to.have.property('lpi');
      expect(response.body).to.have.property('plmnOperatorClasses');
    });

    it('should retrieve LCS privacy data for GLI ueId format', async () => {
      const response = await request(app)
        .get(`/nudm-sdm/v1/${validGliUeId}/lcs-privacy-data`)
        .expect(200);

      expect(response.body).to.have.property('lpi');
    });

    it('should retrieve LCS privacy data for MSISDN ueId format', async () => {
      const response = await request(app)
        .get(`/nudm-sdm/v1/${validMsisdnUeId}/lcs-privacy-data`)
        .expect(200);

      expect(response.body).to.have.property('lpi');
      expect(response.body).to.have.property('unrelatedClass');
    });

    it('should retrieve LCS privacy data for EXTID ueId format', async () => {
      const response = await request(app)
        .get(`/nudm-sdm/v1/${validExtidUeId}/lcs-privacy-data`)
        .expect(200);

      expect(response.body).to.have.property('lpi');
    });

    it('should accept supported-features query parameter', async () => {
      const response = await request(app)
        .get(`/nudm-sdm/v1/${validUeId}/lcs-privacy-data`)
        .query({ 'supported-features': 'feature1,feature2' })
        .expect(200);

      expect(response.body).to.have.property('lpi');
    });

    it('should include proper HTTP headers', async () => {
      const response = await request(app)
        .get(`/nudm-sdm/v1/${validUeId}/lcs-privacy-data`)
        .expect(200);

      expect(response.headers).to.have.property('cache-control');
      expect(response.headers).to.have.property('etag');
      expect(response.headers).to.have.property('last-modified');
    });
  });

  describe('Error cases', () => {
    it('should reject empty ueId', async () => {
      await request(app)
        .get('/nudm-sdm/v1//lcs-privacy-data')
        .expect(400);
    });

    it('should reject ueId with valid prefix but invalid format', async () => {
      await request(app)
        .get('/nudm-sdm/v1/imsi-abc/lcs-privacy-data')
        .expect(400);
    });
  });

  describe('Data structure validation', () => {
    it('should return properly structured LCS privacy data', async () => {
      const response = await request(app)
        .get(`/nudm-sdm/v1/${validUeId}/lcs-privacy-data`)
        .expect(200);

      expect(response.body).to.be.an('object');
      expect(response.body.lpi).to.be.an('object');
      expect(response.body.lpi.locationPrivacyInd).to.be.a('string');
      expect(response.body.lpi.validTimePeriod).to.be.an('object');
      expect(response.body.lpi.validTimePeriod).to.have.property('startTime');
      expect(response.body.lpi.validTimePeriod).to.have.property('endTime');
      expect(response.body.unrelatedClass).to.be.an('object');
      expect(response.body.plmnOperatorClasses).to.be.an('array');
    });

    it('should have valid PLMN operator classes structure', async () => {
      const response = await request(app)
        .get(`/nudm-sdm/v1/${validUeId}/lcs-privacy-data`)
        .expect(200);

      expect(response.body.plmnOperatorClasses).to.have.length.greaterThan(0);
      response.body.plmnOperatorClasses.forEach((operatorClass: any) => {
        expect(operatorClass).to.have.property('lcsClientClass');
        expect(operatorClass).to.have.property('lcsClientIds');
        expect(operatorClass.lcsClientIds).to.be.an('array');
      });
    });

    it('should return consistent data for same ueId', async () => {
      const response1 = await request(app)
        .get(`/nudm-sdm/v1/${validUeId}/lcs-privacy-data`)
        .expect(200);

      const response2 = await request(app)
        .get(`/nudm-sdm/v1/${validUeId}/lcs-privacy-data`)
        .expect(200);

      expect(response1.body).to.deep.equal(response2.body);
    });
  });
});

describe('GET /:supi/lcs-mo-data', () => {
  const validSupi = 'imsi-999700000000001';
  const validNaiSupi = 'nai-user@example.com';
  const validGciSupi = 'gci-ABC123';
  const validGliSupi = 'gli-XYZ789';

  describe('Success cases', () => {
    it('should retrieve LCS MO data for valid IMSI supi', async () => {
      const response = await request(app)
        .get(`/nudm-sdm/v1/${validSupi}/lcs-mo-data`)
        .expect(200)
        .expect('Content-Type', /json/);

      expect(response.body).to.have.property('allowedServiceClasses');
      expect(response.body.allowedServiceClasses).to.be.an('array');
      expect(response.body).to.have.property('moAssistanceDataTypes');
      expect(response.body.moAssistanceDataTypes).to.have.property('locationAssistanceType');
    });

    it('should retrieve LCS MO data for NAI supi format', async () => {
      const response = await request(app)
        .get(`/nudm-sdm/v1/${encodeURIComponent(validNaiSupi)}/lcs-mo-data`)
        .expect(200);

      expect(response.body).to.have.property('allowedServiceClasses');
      expect(response.body).to.have.property('moAssistanceDataTypes');
    });

    it('should retrieve LCS MO data for GCI supi format', async () => {
      const response = await request(app)
        .get(`/nudm-sdm/v1/${validGciSupi}/lcs-mo-data`)
        .expect(200);

      expect(response.body).to.have.property('allowedServiceClasses');
    });

    it('should retrieve LCS MO data for GLI supi format', async () => {
      const response = await request(app)
        .get(`/nudm-sdm/v1/${validGliSupi}/lcs-mo-data`)
        .expect(200);

      expect(response.body).to.have.property('allowedServiceClasses');
    });

    it('should accept supported-features query parameter', async () => {
      const response = await request(app)
        .get(`/nudm-sdm/v1/${validSupi}/lcs-mo-data`)
        .query({ 'supported-features': 'feature1' })
        .expect(200);

      expect(response.body).to.have.property('allowedServiceClasses');
    });

    it('should include proper HTTP headers', async () => {
      const response = await request(app)
        .get(`/nudm-sdm/v1/${validSupi}/lcs-mo-data`)
        .expect(200);

      expect(response.headers).to.have.property('cache-control');
      expect(response.headers).to.have.property('etag');
      expect(response.headers).to.have.property('last-modified');
      expect(response.headers['cache-control']).to.include('max-age');
    });
  });

  describe('Error cases', () => {
    it('should reject invalid supi format', async () => {
      await request(app)
        .get('/nudm-sdm/v1/invalid-supi/lcs-mo-data')
        .expect(400);
    });

    it('should reject empty supi', async () => {
      await request(app)
        .get('/nudm-sdm/v1//lcs-mo-data')
        .expect(400);
    });

    it('should reject MSISDN format (not supported for this endpoint)', async () => {
      await request(app)
        .get('/nudm-sdm/v1/msisdn-1234567890/lcs-mo-data')
        .expect(400);
    });

    it('should reject EXTID format (not supported for this endpoint)', async () => {
      await request(app)
        .get(`/nudm-sdm/v1/${encodeURIComponent('extid-user@example.com')}/lcs-mo-data`)
        .expect(400);
    });
  });

  describe('Data structure validation', () => {
    it('should return properly structured LCS MO data', async () => {
      const response = await request(app)
        .get(`/nudm-sdm/v1/${validSupi}/lcs-mo-data`)
        .expect(200);

      expect(response.body).to.be.an('object');
      expect(response.body.allowedServiceClasses).to.be.an('array');
      expect(response.body.allowedServiceClasses).to.have.length.greaterThan(0);
      expect(response.body.moAssistanceDataTypes).to.be.an('object');
      expect(response.body.moAssistanceDataTypes.locationAssistanceType).to.be.a('string');
    });

    it('should include valid service class values', async () => {
      const response = await request(app)
        .get(`/nudm-sdm/v1/${validSupi}/lcs-mo-data`)
        .expect(200);

      response.body.allowedServiceClasses.forEach((serviceClass: string) => {
        expect(serviceClass).to.be.a('string');
      });
    });

    it('should have location assistance type with valid format', async () => {
      const response = await request(app)
        .get(`/nudm-sdm/v1/${validSupi}/lcs-mo-data`)
        .expect(200);

      expect(response.body.moAssistanceDataTypes.locationAssistanceType).to.match(/[A-Z-]+/);
    });

    it('should return consistent data for same supi', async () => {
      const response1 = await request(app)
        .get(`/nudm-sdm/v1/${validSupi}/lcs-mo-data`)
        .expect(200);

      const response2 = await request(app)
        .get(`/nudm-sdm/v1/${validSupi}/lcs-mo-data`)
        .expect(200);

      expect(response1.body).to.deep.equal(response2.body);
    });
  });
});

describe('GET /:supi/lcs-bca-data', () => {
  const validSupi = 'imsi-999700000000001';
  const validNaiSupi = 'nai-user@example.com';
  const validGciSupi = 'gci-ABC123';
  const validGliSupi = 'gli-XYZ789';

  describe('Success cases', () => {
    it('should retrieve LCS BCA data for valid IMSI supi', async () => {
      const response = await request(app)
        .get(`/nudm-sdm/v1/${validSupi}/lcs-bca-data`)
        .expect(200)
        .expect('Content-Type', /json/);

      expect(response.body).to.have.property('locationAssistanceType');
      expect(response.body.locationAssistanceType).to.be.a('string');
    });

    it('should retrieve LCS BCA data for NAI supi format', async () => {
      const response = await request(app)
        .get(`/nudm-sdm/v1/${encodeURIComponent(validNaiSupi)}/lcs-bca-data`)
        .expect(200);

      expect(response.body).to.have.property('locationAssistanceType');
    });

    it('should retrieve LCS BCA data for GCI supi format', async () => {
      const response = await request(app)
        .get(`/nudm-sdm/v1/${validGciSupi}/lcs-bca-data`)
        .expect(200);

      expect(response.body).to.have.property('locationAssistanceType');
    });

    it('should retrieve LCS BCA data for GLI supi format', async () => {
      const response = await request(app)
        .get(`/nudm-sdm/v1/${validGliSupi}/lcs-bca-data`)
        .expect(200);

      expect(response.body).to.have.property('locationAssistanceType');
    });

    it('should accept plmn-id query parameter', async () => {
      const response = await request(app)
        .get(`/nudm-sdm/v1/${validSupi}/lcs-bca-data`)
        .query({ 'plmn-id': '99970' })
        .expect(200);

      expect(response.body).to.have.property('locationAssistanceType');
    });

    it('should accept supported-features query parameter', async () => {
      const response = await request(app)
        .get(`/nudm-sdm/v1/${validSupi}/lcs-bca-data`)
        .query({ 'supported-features': 'feature1' })
        .expect(200);

      expect(response.body).to.have.property('locationAssistanceType');
    });

    it('should accept both plmn-id and supported-features parameters', async () => {
      const response = await request(app)
        .get(`/nudm-sdm/v1/${validSupi}/lcs-bca-data`)
        .query({
          'plmn-id': '99970',
          'supported-features': 'feature1'
        })
        .expect(200);

      expect(response.body).to.have.property('locationAssistanceType');
    });

    it('should include proper HTTP headers', async () => {
      const response = await request(app)
        .get(`/nudm-sdm/v1/${validSupi}/lcs-bca-data`)
        .expect(200);

      expect(response.headers).to.have.property('cache-control');
      expect(response.headers).to.have.property('etag');
      expect(response.headers).to.have.property('last-modified');
    });
  });

  describe('Error cases', () => {
    it('should reject invalid supi format', async () => {
      await request(app)
        .get('/nudm-sdm/v1/invalid-supi/lcs-bca-data')
        .expect(400);
    });

    it('should reject empty supi', async () => {
      await request(app)
        .get('/nudm-sdm/v1//lcs-bca-data')
        .expect(400);
    });

    it('should reject MSISDN format (not supported for this endpoint)', async () => {
      await request(app)
        .get('/nudm-sdm/v1/msisdn-1234567890/lcs-bca-data')
        .expect(400);
    });

    it('should reject unsupported supi prefix', async () => {
      await request(app)
        .get('/nudm-sdm/v1/unsupported-12345/lcs-bca-data')
        .expect(400);
    });
  });

  describe('Data structure validation', () => {
    it('should return properly structured LCS BCA data', async () => {
      const response = await request(app)
        .get(`/nudm-sdm/v1/${validSupi}/lcs-bca-data`)
        .expect(200);

      expect(response.body).to.be.an('object');
      expect(response.body.locationAssistanceType).to.be.a('string');
    });

    it('should have location assistance type with comma-separated values', async () => {
      const response = await request(app)
        .get(`/nudm-sdm/v1/${validSupi}/lcs-bca-data`)
        .expect(200);

      expect(response.body.locationAssistanceType).to.include(',');
    });

    it('should return JSON content type', async () => {
      await request(app)
        .get(`/nudm-sdm/v1/${validSupi}/lcs-bca-data`)
        .expect(200)
        .expect('Content-Type', /json/);
    });

    it('should return consistent data for same supi', async () => {
      const response1 = await request(app)
        .get(`/nudm-sdm/v1/${validSupi}/lcs-bca-data`)
        .expect(200);

      const response2 = await request(app)
        .get(`/nudm-sdm/v1/${validSupi}/lcs-bca-data`)
        .expect(200);

      expect(response1.body).to.deep.equal(response2.body);
    });
  });
});

describe('GET /:supi/lcs-subscription-data', () => {
  const validSupi = 'imsi-999700000000001';
  const validNaiSupi = 'nai-user@example.com';
  const validGciSupi = 'gci-ABC123';
  const validGliSupi = 'gli-XYZ789';

  describe('Success cases', () => {
    it('should retrieve LCS subscription data for valid IMSI supi', async () => {
      const response = await request(app)
        .get(`/nudm-sdm/v1/${validSupi}/lcs-subscription-data`)
        .expect(200)
        .expect('Content-Type', /json/);

      expect(response.body).to.have.property('configuredLmfId');
      expect(response.body).to.have.property('pruInd');
      expect(response.body).to.have.property('lpHapType');
      expect(response.body).to.have.property('userPlanePosIndLmf');
    });

    it('should retrieve LCS subscription data for NAI supi format', async () => {
      const response = await request(app)
        .get(`/nudm-sdm/v1/${encodeURIComponent(validNaiSupi)}/lcs-subscription-data`)
        .expect(200);

      expect(response.body).to.have.property('configuredLmfId');
      expect(response.body).to.have.property('pruInd');
    });

    it('should retrieve LCS subscription data for GCI supi format', async () => {
      const response = await request(app)
        .get(`/nudm-sdm/v1/${validGciSupi}/lcs-subscription-data`)
        .expect(200);

      expect(response.body).to.have.property('configuredLmfId');
    });

    it('should retrieve LCS subscription data for GLI supi format', async () => {
      const response = await request(app)
        .get(`/nudm-sdm/v1/${validGliSupi}/lcs-subscription-data`)
        .expect(200);

      expect(response.body).to.have.property('configuredLmfId');
    });

    it('should accept supported-features query parameter', async () => {
      const response = await request(app)
        .get(`/nudm-sdm/v1/${validSupi}/lcs-subscription-data`)
        .query({ 'supported-features': 'feature1' })
        .expect(200);

      expect(response.body).to.have.property('configuredLmfId');
    });

    it('should include proper HTTP headers', async () => {
      const response = await request(app)
        .get(`/nudm-sdm/v1/${validSupi}/lcs-subscription-data`)
        .expect(200);

      expect(response.headers).to.have.property('cache-control');
      expect(response.headers).to.have.property('etag');
      expect(response.headers).to.have.property('last-modified');
    });

    it('should have ETag with supi reference', async () => {
      const response = await request(app)
        .get(`/nudm-sdm/v1/${validSupi}/lcs-subscription-data`)
        .expect(200);

      expect(response.headers.etag).to.be.a('string');
      expect(response.headers.etag).to.include('lcssubsdata');
    });
  });

  describe('Error cases', () => {
    it('should reject invalid supi format', async () => {
      await request(app)
        .get('/nudm-sdm/v1/invalid-supi/lcs-subscription-data')
        .expect(400);
    });

    it('should reject empty supi', async () => {
      await request(app)
        .get('/nudm-sdm/v1//lcs-subscription-data')
        .expect(400);
    });

    it('should reject MSISDN format (not supported for this endpoint)', async () => {
      await request(app)
        .get('/nudm-sdm/v1/msisdn-1234567890/lcs-subscription-data')
        .expect(400);
    });

    it('should reject EXTID format (not supported for this endpoint)', async () => {
      await request(app)
        .get(`/nudm-sdm/v1/${encodeURIComponent('extid-user@example.com')}/lcs-subscription-data`)
        .expect(400);
    });

    it('should reject unsupported supi prefix', async () => {
      await request(app)
        .get('/nudm-sdm/v1/unsupported-12345/lcs-subscription-data')
        .expect(400);
    });
  });

  describe('Data structure validation', () => {
    it('should return properly structured LCS subscription data', async () => {
      const response = await request(app)
        .get(`/nudm-sdm/v1/${validSupi}/lcs-subscription-data`)
        .expect(200);

      expect(response.body).to.be.an('object');
      expect(response.body.configuredLmfId).to.be.a('string');
      expect(response.body.pruInd).to.be.a('string');
      expect(response.body.lpHapType).to.be.a('string');
      expect(response.body.userPlanePosIndLmf).to.be.a('boolean');
    });

    it('should have all required fields', async () => {
      const response = await request(app)
        .get(`/nudm-sdm/v1/${validSupi}/lcs-subscription-data`)
        .expect(200);

      const requiredFields = [
        'configuredLmfId',
        'pruInd',
        'lpHapType',
        'userPlanePosIndLmf'
      ];

      requiredFields.forEach(field => {
        expect(response.body).to.have.property(field);
      });
    });

    it('should have configuredLmfId based on supi', async () => {
      const response = await request(app)
        .get(`/nudm-sdm/v1/${validSupi}/lcs-subscription-data`)
        .expect(200);

      expect(response.body.configuredLmfId).to.include('lmf-');
    });

    it('should return JSON content type', async () => {
      await request(app)
        .get(`/nudm-sdm/v1/${validSupi}/lcs-subscription-data`)
        .expect(200)
        .expect('Content-Type', /json/);
    });

    it('should return consistent data for same supi', async () => {
      const response1 = await request(app)
        .get(`/nudm-sdm/v1/${validSupi}/lcs-subscription-data`)
        .expect(200);

      const response2 = await request(app)
        .get(`/nudm-sdm/v1/${validSupi}/lcs-subscription-data`)
        .expect(200);

      expect(response1.body).to.deep.equal(response2.body);
    });
  });

  describe('Multiple requests handling', () => {
    it('should handle concurrent requests for different supis', async () => {
      const supi1 = 'imsi-999700000000001';
      const supi2 = 'imsi-999700000000002';

      const [response1, response2] = await Promise.all([
        request(app).get(`/nudm-sdm/v1/${supi1}/lcs-subscription-data`),
        request(app).get(`/nudm-sdm/v1/${supi2}/lcs-subscription-data`)
      ]);

      expect(response1.status).to.equal(200);
      expect(response2.status).to.equal(200);
      expect(response1.body.configuredLmfId).to.not.equal(response2.body.configuredLmfId);
    });

    it('should handle special characters in NAI supi', async () => {
      const specialNaiSupi = 'nai-user+test@example.com';
      const response = await request(app)
        .get(`/nudm-sdm/v1/${encodeURIComponent(specialNaiSupi)}/lcs-subscription-data`)
        .expect(200);

      expect(response.body).to.have.property('configuredLmfId');
    });
  });
});

describe('GET /:supi/v2x-data', () => {
  const validSupi = 'imsi-999700000000001';
  const validNaiSupi = 'nai-user@example.com';
  const validGciSupi = 'gci-ABC123';
  const validGliSupi = 'gli-XYZ789';

  describe('Success cases', () => {
    it('should retrieve V2X data for valid IMSI supi', async () => {
      const response = await request(app)
        .get(`/nudm-sdm/v1/${validSupi}/v2x-data`)
        .expect(200)
        .expect('Content-Type', /json/);

      expect(response.body).to.have.property('nrV2xServicesAuth');
      expect(response.body).to.have.property('lteV2xServicesAuth');
      expect(response.body).to.have.property('nrUePc5Ambr');
      expect(response.body).to.have.property('ltePc5Ambr');
    });

    it('should retrieve V2X data for NAI supi format', async () => {
      const response = await request(app)
        .get(`/nudm-sdm/v1/${encodeURIComponent(validNaiSupi)}/v2x-data`)
        .expect(200);

      expect(response.body).to.have.property('nrV2xServicesAuth');
      expect(response.body).to.have.property('lteV2xServicesAuth');
    });

    it('should retrieve V2X data for GCI supi format', async () => {
      const response = await request(app)
        .get(`/nudm-sdm/v1/${validGciSupi}/v2x-data`)
        .expect(200);

      expect(response.body).to.have.property('nrV2xServicesAuth');
    });

    it('should retrieve V2X data for GLI supi format', async () => {
      const response = await request(app)
        .get(`/nudm-sdm/v1/${validGliSupi}/v2x-data`)
        .expect(200);

      expect(response.body).to.have.property('nrV2xServicesAuth');
    });

    it('should accept supported-features query parameter', async () => {
      const response = await request(app)
        .get(`/nudm-sdm/v1/${validSupi}/v2x-data`)
        .query({ 'supported-features': 'feature1' })
        .expect(200);

      expect(response.body).to.have.property('nrV2xServicesAuth');
    });

    it('should include proper HTTP headers', async () => {
      const response = await request(app)
        .get(`/nudm-sdm/v1/${validSupi}/v2x-data`)
        .expect(200);

      expect(response.headers).to.have.property('cache-control');
      expect(response.headers).to.have.property('etag');
      expect(response.headers).to.have.property('last-modified');
    });
  });

  describe('Error cases', () => {
    it('should reject invalid supi format', async () => {
      await request(app)
        .get('/nudm-sdm/v1/invalid-supi/v2x-data')
        .expect(400);
    });

    it('should reject empty supi', async () => {
      await request(app)
        .get('/nudm-sdm/v1//v2x-data')
        .expect(400);
    });

    it('should reject MSISDN format (not supported for this endpoint)', async () => {
      await request(app)
        .get('/nudm-sdm/v1/msisdn-1234567890/v2x-data')
        .expect(400);
    });

    it('should reject unsupported supi prefix', async () => {
      await request(app)
        .get('/nudm-sdm/v1/unsupported-12345/v2x-data')
        .expect(400);
    });
  });

  describe('Data structure validation', () => {
    it('should return properly structured V2X data', async () => {
      const response = await request(app)
        .get(`/nudm-sdm/v1/${validSupi}/v2x-data`)
        .expect(200);

      expect(response.body).to.be.an('object');
      expect(response.body.nrV2xServicesAuth).to.have.property('vehicleUe');
      expect(response.body.nrV2xServicesAuth).to.have.property('pedestrianUe');
      expect(response.body.nrV2xServicesAuth).to.have.property('v2xPermission');
      expect(response.body.lteV2xServicesAuth).to.have.property('vehicleUe');
      expect(response.body.lteV2xServicesAuth).to.have.property('pedestrianUe');
      expect(response.body.lteV2xServicesAuth).to.have.property('v2xPermission');
    });

    it('should return JSON content type', async () => {
      await request(app)
        .get(`/nudm-sdm/v1/${validSupi}/v2x-data`)
        .expect(200)
        .expect('Content-Type', /json/);
    });

    it('should return consistent data for same supi', async () => {
      const response1 = await request(app)
        .get(`/nudm-sdm/v1/${validSupi}/v2x-data`)
        .expect(200);

      const response2 = await request(app)
        .get(`/nudm-sdm/v1/${validSupi}/v2x-data`)
        .expect(200);

      expect(response1.body).to.deep.equal(response2.body);
    });
  });
});

describe('GET /:supi/prose-data', () => {
  const validSupi = 'imsi-999700000000001';
  const validNaiSupi = 'nai-user@example.com';
  const validGciSupi = 'gci-ABC123';
  const validGliSupi = 'gli-XYZ789';

  describe('Success cases', () => {
    it('should retrieve ProSe data for valid IMSI supi', async () => {
      const response = await request(app)
        .get(`/nudm-sdm/v1/${validSupi}/prose-data`)
        .expect(200)
        .expect('Content-Type', /json/);

      expect(response.body).to.have.property('proseServiceAuth');
      expect(response.body).to.have.property('nrUePc5Ambr');
      expect(response.body).to.have.property('proseAllowedPlmn');
    });

    it('should retrieve ProSe data for NAI supi format', async () => {
      const response = await request(app)
        .get(`/nudm-sdm/v1/${encodeURIComponent(validNaiSupi)}/prose-data`)
        .expect(200);

      expect(response.body).to.have.property('proseServiceAuth');
      expect(response.body).to.have.property('nrUePc5Ambr');
    });

    it('should retrieve ProSe data for GCI supi format', async () => {
      const response = await request(app)
        .get(`/nudm-sdm/v1/${validGciSupi}/prose-data`)
        .expect(200);

      expect(response.body).to.have.property('proseServiceAuth');
    });

    it('should retrieve ProSe data for GLI supi format', async () => {
      const response = await request(app)
        .get(`/nudm-sdm/v1/${validGliSupi}/prose-data`)
        .expect(200);

      expect(response.body).to.have.property('proseServiceAuth');
    });

    it('should accept supported-features query parameter', async () => {
      const response = await request(app)
        .get(`/nudm-sdm/v1/${validSupi}/prose-data`)
        .query({ 'supported-features': 'feature1' })
        .expect(200);

      expect(response.body).to.have.property('proseServiceAuth');
    });

    it('should include proper HTTP headers', async () => {
      const response = await request(app)
        .get(`/nudm-sdm/v1/${validSupi}/prose-data`)
        .expect(200);

      expect(response.headers).to.have.property('cache-control');
      expect(response.headers).to.have.property('etag');
      expect(response.headers).to.have.property('last-modified');
    });
  });

  describe('Error cases', () => {
    it('should reject invalid supi format', async () => {
      await request(app)
        .get('/nudm-sdm/v1/invalid-supi/prose-data')
        .expect(400);
    });

    it('should reject empty supi', async () => {
      await request(app)
        .get('/nudm-sdm/v1//prose-data')
        .expect(400);
    });

    it('should reject MSISDN format (not supported for this endpoint)', async () => {
      await request(app)
        .get('/nudm-sdm/v1/msisdn-1234567890/prose-data')
        .expect(400);
    });

    it('should reject unsupported supi prefix', async () => {
      await request(app)
        .get('/nudm-sdm/v1/unsupported-12345/prose-data')
        .expect(400);
    });
  });

  describe('Data structure validation', () => {
    it('should return properly structured ProSe data', async () => {
      const response = await request(app)
        .get(`/nudm-sdm/v1/${validSupi}/prose-data`)
        .expect(200);

      expect(response.body).to.be.an('object');
      expect(response.body.proseServiceAuth).to.have.property('proseDirectDiscoveryAuth');
      expect(response.body.proseServiceAuth).to.have.property('proseDirectCommunicationAuth');
      expect(response.body.proseServiceAuth).to.have.property('proseL2RelayAuth');
      expect(response.body.proseServiceAuth).to.have.property('proseL2RemoteAuth');
    });

    it('should return JSON content type', async () => {
      await request(app)
        .get(`/nudm-sdm/v1/${validSupi}/prose-data`)
        .expect(200)
        .expect('Content-Type', /json/);
    });

    it('should return consistent data for same supi', async () => {
      const response1 = await request(app)
        .get(`/nudm-sdm/v1/${validSupi}/prose-data`)
        .expect(200);

      const response2 = await request(app)
        .get(`/nudm-sdm/v1/${validSupi}/prose-data`)
        .expect(200);

      expect(response1.body).to.deep.equal(response2.body);
    });
  });
});

describe('GET /:supi/5mbs-data', () => {
  const validSupi = 'imsi-999700000000001';
  const validNaiSupi = 'nai-user@example.com';
  const validGciSupi = 'gci-ABC123';
  const validGliSupi = 'gli-XYZ789';

  describe('Success cases', () => {
    it('should retrieve 5MBS data for valid IMSI supi', async () => {
      const response = await request(app)
        .get(`/nudm-sdm/v1/${validSupi}/5mbs-data`)
        .expect(200)
        .expect('Content-Type', /json/);

      expect(response.body).to.have.property('mbsAllowed');
      expect(response.body).to.have.property('mbsSessionIdList');
    });

    it('should retrieve 5MBS data for NAI supi format', async () => {
      const response = await request(app)
        .get(`/nudm-sdm/v1/${encodeURIComponent(validNaiSupi)}/5mbs-data`)
        .expect(200);

      expect(response.body).to.have.property('mbsAllowed');
      expect(response.body).to.have.property('mbsSessionIdList');
    });

    it('should retrieve 5MBS data for GCI supi format', async () => {
      const response = await request(app)
        .get(`/nudm-sdm/v1/${validGciSupi}/5mbs-data`)
        .expect(200);

      expect(response.body).to.have.property('mbsAllowed');
    });

    it('should retrieve 5MBS data for GLI supi format', async () => {
      const response = await request(app)
        .get(`/nudm-sdm/v1/${validGliSupi}/5mbs-data`)
        .expect(200);

      expect(response.body).to.have.property('mbsAllowed');
    });

    it('should accept supported-features query parameter', async () => {
      const response = await request(app)
        .get(`/nudm-sdm/v1/${validSupi}/5mbs-data`)
        .query({ 'supported-features': 'feature1' })
        .expect(200);

      expect(response.body).to.have.property('mbsAllowed');
    });

    it('should include proper HTTP headers', async () => {
      const response = await request(app)
        .get(`/nudm-sdm/v1/${validSupi}/5mbs-data`)
        .expect(200);

      expect(response.headers).to.have.property('cache-control');
      expect(response.headers).to.have.property('etag');
      expect(response.headers).to.have.property('last-modified');
    });
  });

  describe('Error cases', () => {
    it('should reject invalid supi format', async () => {
      await request(app)
        .get('/nudm-sdm/v1/invalid-supi/5mbs-data')
        .expect(400);
    });

    it('should reject empty supi', async () => {
      await request(app)
        .get('/nudm-sdm/v1//5mbs-data')
        .expect(400);
    });

    it('should reject MSISDN format (not supported for this endpoint)', async () => {
      await request(app)
        .get('/nudm-sdm/v1/msisdn-1234567890/5mbs-data')
        .expect(400);
    });

    it('should reject unsupported supi prefix', async () => {
      await request(app)
        .get('/nudm-sdm/v1/unsupported-12345/5mbs-data')
        .expect(400);
    });
  });

  describe('Data structure validation', () => {
    it('should return properly structured 5MBS data', async () => {
      const response = await request(app)
        .get(`/nudm-sdm/v1/${validSupi}/5mbs-data`)
        .expect(200);

      expect(response.body).to.be.an('object');
      expect(response.body.mbsAllowed).to.be.a('boolean');
      expect(response.body.mbsSessionIdList).to.be.an('array');
      expect(response.body.mbsSessionIdList).to.have.length.above(0);
    });

    it('should return JSON content type', async () => {
      await request(app)
        .get(`/nudm-sdm/v1/${validSupi}/5mbs-data`)
        .expect(200)
        .expect('Content-Type', /json/);
    });

    it('should return consistent data for same supi', async () => {
      const response1 = await request(app)
        .get(`/nudm-sdm/v1/${validSupi}/5mbs-data`)
        .expect(200);

      const response2 = await request(app)
        .get(`/nudm-sdm/v1/${validSupi}/5mbs-data`)
        .expect(200);

      expect(response1.body).to.deep.equal(response2.body);
    });
  });
});

describe('GET /:supi/uc-data', () => {
  const validSupi = 'imsi-999700000000001';
  const validNaiSupi = 'nai-user@example.com';
  const validGciSupi = 'gci-ABC123';
  const validGliSupi = 'gli-XYZ789';

  describe('Success cases', () => {
    it('should retrieve UC data for valid IMSI supi', async () => {
      const response = await request(app)
        .get(`/nudm-sdm/v1/${validSupi}/uc-data`)
        .expect(200)
        .expect('Content-Type', /json/);

      expect(response.body).to.have.property('userConsentPerPurposeList');
    });

    it('should retrieve UC data for NAI supi format', async () => {
      const response = await request(app)
        .get(`/nudm-sdm/v1/${encodeURIComponent(validNaiSupi)}/uc-data`)
        .expect(200);

      expect(response.body).to.have.property('userConsentPerPurposeList');
    });

    it('should retrieve UC data for GCI supi format', async () => {
      const response = await request(app)
        .get(`/nudm-sdm/v1/${validGciSupi}/uc-data`)
        .expect(200);

      expect(response.body).to.have.property('userConsentPerPurposeList');
    });

    it('should retrieve UC data for GLI supi format', async () => {
      const response = await request(app)
        .get(`/nudm-sdm/v1/${validGliSupi}/uc-data`)
        .expect(200);

      expect(response.body).to.have.property('userConsentPerPurposeList');
    });

    it('should accept supported-features query parameter', async () => {
      const response = await request(app)
        .get(`/nudm-sdm/v1/${validSupi}/uc-data`)
        .query({ 'supported-features': 'feature1' })
        .expect(200);

      expect(response.body).to.have.property('userConsentPerPurposeList');
    });

    it('should filter by uc-purpose query parameter', async () => {
      const response = await request(app)
        .get(`/nudm-sdm/v1/${validSupi}/uc-data`)
        .query({ 'uc-purpose': 'ANALYTICS' })
        .expect(200);

      expect(response.body).to.have.property('userConsentPerPurposeList');
      expect(response.body.userConsentPerPurposeList).to.have.property('ANALYTICS');
      expect(Object.keys(response.body.userConsentPerPurposeList)).to.have.length(1);
    });

    it('should return all consent purposes without uc-purpose filter', async () => {
      const response = await request(app)
        .get(`/nudm-sdm/v1/${validSupi}/uc-data`)
        .expect(200);

      expect(response.body.userConsentPerPurposeList).to.be.an('object');
      expect(Object.keys(response.body.userConsentPerPurposeList).length).to.be.greaterThan(1);
    });
  });

  describe('Error cases', () => {
    it('should reject invalid supi format', async () => {
      await request(app)
        .get('/nudm-sdm/v1/invalid-supi/uc-data')
        .expect(400);
    });

    it('should reject empty supi', async () => {
      await request(app)
        .get('/nudm-sdm/v1//uc-data')
        .expect(400);
    });

    it('should reject MSISDN format (not supported for this endpoint)', async () => {
      await request(app)
        .get('/nudm-sdm/v1/msisdn-1234567890/uc-data')
        .expect(400);
    });

    it('should reject unsupported supi prefix', async () => {
      await request(app)
        .get('/nudm-sdm/v1/unsupported-12345/uc-data')
        .expect(400);
    });

    it('should reject invalid uc-purpose value', async () => {
      await request(app)
        .get(`/nudm-sdm/v1/${validSupi}/uc-data`)
        .query({ 'uc-purpose': 'INVALID_PURPOSE' })
        .expect(400);
    });
  });

  describe('Data structure validation', () => {
    it('should return properly structured UC data', async () => {
      const response = await request(app)
        .get(`/nudm-sdm/v1/${validSupi}/uc-data`)
        .expect(200);

      expect(response.body).to.be.an('object');
      expect(response.body.userConsentPerPurposeList).to.be.an('object');
    });

    it('should return JSON content type', async () => {
      await request(app)
        .get(`/nudm-sdm/v1/${validSupi}/uc-data`)
        .expect(200)
        .expect('Content-Type', /json/);
    });

    it('should return consistent data for same supi', async () => {
      const response1 = await request(app)
        .get(`/nudm-sdm/v1/${validSupi}/uc-data`)
        .expect(200);

      const response2 = await request(app)
        .get(`/nudm-sdm/v1/${validSupi}/uc-data`)
        .expect(200);

      expect(response1.body).to.deep.equal(response2.body);
    });
  });
});

describe('GET /:supi/time-sync-data', () => {
  const validSupi = 'imsi-999700000000001';
  const validNaiSupi = 'nai-user@example.com';
  const validGciSupi = 'gci-ABC123';
  const validGliSupi = 'gli-XYZ789';

  describe('Success cases', () => {
    it('should retrieve time sync data for valid IMSI supi', async () => {
      const response = await request(app)
        .get(`/nudm-sdm/v1/${validSupi}/time-sync-data`)
        .expect(200)
        .expect('Content-Type', /json/);

      expect(response.body).to.have.property('afReqAuthorizations');
      expect(response.body).to.have.property('serviceIds');
    });

    it('should retrieve time sync data for NAI supi format', async () => {
      const response = await request(app)
        .get(`/nudm-sdm/v1/${encodeURIComponent(validNaiSupi)}/time-sync-data`)
        .expect(200);

      expect(response.body).to.have.property('afReqAuthorizations');
      expect(response.body).to.have.property('serviceIds');
    });

    it('should retrieve time sync data for GCI supi format', async () => {
      const response = await request(app)
        .get(`/nudm-sdm/v1/${validGciSupi}/time-sync-data`)
        .expect(200);

      expect(response.body).to.have.property('afReqAuthorizations');
    });

    it('should retrieve time sync data for GLI supi format', async () => {
      const response = await request(app)
        .get(`/nudm-sdm/v1/${validGliSupi}/time-sync-data`)
        .expect(200);

      expect(response.body).to.have.property('afReqAuthorizations');
    });

    it('should accept supported-features query parameter', async () => {
      const response = await request(app)
        .get(`/nudm-sdm/v1/${validSupi}/time-sync-data`)
        .query({ 'supported-features': 'feature1' })
        .expect(200);

      expect(response.body).to.have.property('afReqAuthorizations');
    });

    it('should include proper HTTP headers', async () => {
      const response = await request(app)
        .get(`/nudm-sdm/v1/${validSupi}/time-sync-data`)
        .expect(200);

      expect(response.headers).to.have.property('cache-control');
      expect(response.headers).to.have.property('etag');
      expect(response.headers).to.have.property('last-modified');
    });
  });

  describe('Error cases', () => {
    it('should reject invalid supi format', async () => {
      await request(app)
        .get('/nudm-sdm/v1/invalid-supi/time-sync-data')
        .expect(400);
    });

    it('should reject empty supi', async () => {
      await request(app)
        .get('/nudm-sdm/v1//time-sync-data')
        .expect(400);
    });

    it('should reject MSISDN format (not supported for this endpoint)', async () => {
      await request(app)
        .get('/nudm-sdm/v1/msisdn-1234567890/time-sync-data')
        .expect(400);
    });

    it('should reject unsupported supi prefix', async () => {
      await request(app)
        .get('/nudm-sdm/v1/unsupported-12345/time-sync-data')
        .expect(400);
    });
  });

  describe('Data structure validation', () => {
    it('should return properly structured time sync data', async () => {
      const response = await request(app)
        .get(`/nudm-sdm/v1/${validSupi}/time-sync-data`)
        .expect(200);

      expect(response.body).to.be.an('object');
      expect(response.body.afReqAuthorizations).to.have.property('gptpAllowedInfoList');
      expect(response.body.afReqAuthorizations.gptpAllowedInfoList).to.be.an('array');
      expect(response.body.serviceIds).to.be.an('array');
    });

    it('should return JSON content type', async () => {
      await request(app)
        .get(`/nudm-sdm/v1/${validSupi}/time-sync-data`)
        .expect(200)
        .expect('Content-Type', /json/);
    });

    it('should return consistent data for same supi', async () => {
      const response1 = await request(app)
        .get(`/nudm-sdm/v1/${validSupi}/time-sync-data`)
        .expect(200);

      const response2 = await request(app)
        .get(`/nudm-sdm/v1/${validSupi}/time-sync-data`)
        .expect(200);

      expect(response1.body).to.deep.equal(response2.body);
    });
  });
});

describe('GET /:supi/ranging-slpos-data', () => {
  const validSupi = 'imsi-999700000000001';
  const validNaiSupi = 'nai-user@example.com';
  const validGciSupi = 'gci-ABC123';
  const validGliSupi = 'gli-XYZ789';

  describe('Success cases', () => {
    it('should retrieve ranging SLPOS data for valid IMSI supi', async () => {
      const response = await request(app)
        .get(`/nudm-sdm/v1/${validSupi}/ranging-slpos-data`)
        .expect(200)
        .expect('Content-Type', /json/);

      expect(response.body).to.have.property('rangingSlPosAuth');
      expect(response.body).to.have.property('rangingSlPosPlmn');
      expect(response.body).to.have.property('rangingSlPosQos');
    });

    it('should retrieve ranging SLPOS data for NAI supi format', async () => {
      const response = await request(app)
        .get(`/nudm-sdm/v1/${encodeURIComponent(validNaiSupi)}/ranging-slpos-data`)
        .expect(200);

      expect(response.body).to.have.property('rangingSlPosAuth');
      expect(response.body).to.have.property('rangingSlPosPlmn');
    });

    it('should retrieve ranging SLPOS data for GCI supi format', async () => {
      const response = await request(app)
        .get(`/nudm-sdm/v1/${validGciSupi}/ranging-slpos-data`)
        .expect(200);

      expect(response.body).to.have.property('rangingSlPosAuth');
    });

    it('should retrieve ranging SLPOS data for GLI supi format', async () => {
      const response = await request(app)
        .get(`/nudm-sdm/v1/${validGliSupi}/ranging-slpos-data`)
        .expect(200);

      expect(response.body).to.have.property('rangingSlPosAuth');
    });

    it('should accept supported-features query parameter', async () => {
      const response = await request(app)
        .get(`/nudm-sdm/v1/${validSupi}/ranging-slpos-data`)
        .query({ 'supported-features': 'feature1' })
        .expect(200);

      expect(response.body).to.have.property('rangingSlPosAuth');
    });

    it('should include proper HTTP headers', async () => {
      const response = await request(app)
        .get(`/nudm-sdm/v1/${validSupi}/ranging-slpos-data`)
        .expect(200);

      expect(response.headers).to.have.property('cache-control');
      expect(response.headers).to.have.property('etag');
      expect(response.headers).to.have.property('last-modified');
    });
  });

  describe('Error cases', () => {
    it('should reject invalid supi format', async () => {
      await request(app)
        .get('/nudm-sdm/v1/invalid-supi/ranging-slpos-data')
        .expect(400);
    });

    it('should reject empty supi', async () => {
      await request(app)
        .get('/nudm-sdm/v1//ranging-slpos-data')
        .expect(400);
    });

    it('should reject MSISDN format (not supported for this endpoint)', async () => {
      await request(app)
        .get('/nudm-sdm/v1/msisdn-1234567890/ranging-slpos-data')
        .expect(400);
    });

    it('should reject unsupported supi prefix', async () => {
      await request(app)
        .get('/nudm-sdm/v1/unsupported-12345/ranging-slpos-data')
        .expect(400);
    });
  });

  describe('Data structure validation', () => {
    it('should return properly structured ranging SLPOS data', async () => {
      const response = await request(app)
        .get(`/nudm-sdm/v1/${validSupi}/ranging-slpos-data`)
        .expect(200);

      expect(response.body).to.be.an('object');
      expect(response.body.rangingSlPosAuth).to.have.property('rangingAllowed');
      expect(response.body.rangingSlPosAuth).to.have.property('sl1AllowedIndication');
      expect(response.body.rangingSlPosQos).to.have.property('hAccuracy');
      expect(response.body.rangingSlPosQos).to.have.property('vAccuracy');
    });

    it('should return JSON content type', async () => {
      await request(app)
        .get(`/nudm-sdm/v1/${validSupi}/ranging-slpos-data`)
        .expect(200)
        .expect('Content-Type', /json/);
    });

    it('should return consistent data for same supi', async () => {
      const response1 = await request(app)
        .get(`/nudm-sdm/v1/${validSupi}/ranging-slpos-data`)
        .expect(200);

      const response2 = await request(app)
        .get(`/nudm-sdm/v1/${validSupi}/ranging-slpos-data`)
        .expect(200);

      expect(response1.body).to.deep.equal(response2.body);
    });
  });
});

describe('GET /:supi/a2x-data', () => {
  const validSupi = 'imsi-999700000000001';
  const validNaiSupi = 'nai-user@example.com';
  const validGciSupi = 'gci-ABC123';
  const validGliSupi = 'gli-XYZ789';

  describe('Success cases', () => {
    it('should retrieve A2X data for valid IMSI supi', async () => {
      const response = await request(app)
        .get(`/nudm-sdm/v1/${validSupi}/a2x-data`)
        .expect(200)
        .expect('Content-Type', /json/);

      expect(response.body).to.have.property('nrA2xServicesAuth');
      expect(response.body).to.have.property('lteA2xServicesAuth');
      expect(response.body).to.have.property('nrUePc5Ambr');
      expect(response.body).to.have.property('ltePc5Ambr');
    });

    it('should retrieve A2X data for NAI supi format', async () => {
      const response = await request(app)
        .get(`/nudm-sdm/v1/${encodeURIComponent(validNaiSupi)}/a2x-data`)
        .expect(200);

      expect(response.body).to.have.property('nrA2xServicesAuth');
      expect(response.body).to.have.property('lteA2xServicesAuth');
    });

    it('should retrieve A2X data for GCI supi format', async () => {
      const response = await request(app)
        .get(`/nudm-sdm/v1/${validGciSupi}/a2x-data`)
        .expect(200);

      expect(response.body).to.have.property('nrA2xServicesAuth');
    });

    it('should retrieve A2X data for GLI supi format', async () => {
      const response = await request(app)
        .get(`/nudm-sdm/v1/${validGliSupi}/a2x-data`)
        .expect(200);

      expect(response.body).to.have.property('nrA2xServicesAuth');
    });

    it('should accept supported-features query parameter', async () => {
      const response = await request(app)
        .get(`/nudm-sdm/v1/${validSupi}/a2x-data`)
        .query({ 'supported-features': 'feature1' })
        .expect(200);

      expect(response.body).to.have.property('nrA2xServicesAuth');
    });

    it('should include proper HTTP headers', async () => {
      const response = await request(app)
        .get(`/nudm-sdm/v1/${validSupi}/a2x-data`)
        .expect(200);

      expect(response.headers).to.have.property('cache-control');
      expect(response.headers).to.have.property('etag');
      expect(response.headers).to.have.property('last-modified');
    });
  });

  describe('Error cases', () => {
    it('should reject invalid supi format', async () => {
      await request(app)
        .get('/nudm-sdm/v1/invalid-supi/a2x-data')
        .expect(400);
    });

    it('should reject empty supi', async () => {
      await request(app)
        .get('/nudm-sdm/v1//a2x-data')
        .expect(400);
    });

    it('should reject MSISDN format (not supported for this endpoint)', async () => {
      await request(app)
        .get('/nudm-sdm/v1/msisdn-1234567890/a2x-data')
        .expect(400);
    });

    it('should reject unsupported supi prefix', async () => {
      await request(app)
        .get('/nudm-sdm/v1/unsupported-12345/a2x-data')
        .expect(400);
    });
  });

  describe('Data structure validation', () => {
    it('should return properly structured A2X data', async () => {
      const response = await request(app)
        .get(`/nudm-sdm/v1/${validSupi}/a2x-data`)
        .expect(200);

      expect(response.body).to.be.an('object');
      expect(response.body.nrA2xServicesAuth).to.have.property('vehicleUe');
      expect(response.body.nrA2xServicesAuth).to.have.property('pedestrianUe');
      expect(response.body.nrA2xServicesAuth).to.have.property('a2xPermission');
      expect(response.body.lteA2xServicesAuth).to.have.property('vehicleUe');
      expect(response.body.lteA2xServicesAuth).to.have.property('pedestrianUe');
      expect(response.body.lteA2xServicesAuth).to.have.property('a2xPermission');
    });

    it('should return JSON content type', async () => {
      await request(app)
        .get(`/nudm-sdm/v1/${validSupi}/a2x-data`)
        .expect(200)
        .expect('Content-Type', /json/);
    });

    it('should return consistent data for same supi', async () => {
      const response1 = await request(app)
        .get(`/nudm-sdm/v1/${validSupi}/a2x-data`)
        .expect(200);

      const response2 = await request(app)
        .get(`/nudm-sdm/v1/${validSupi}/a2x-data`)
        .expect(200);

      expect(response1.body).to.deep.equal(response2.body);
    });
  });
});

describe('GET /:ueId/rangingsl-privacy-data', () => {
  const validUeIdImsi = 'imsi-999700000000001';
  const validUeIdNai = 'nai-user@example.com';
  const validUeIdMsisdn = 'msisdn-1234567890';
  const validUeIdExtid = 'extid-user@example.com';
  const validUeIdGci = 'gci-ABC123';
  const validUeIdGli = 'gli-XYZ789';

  describe('Success cases', () => {
    it('should retrieve ranging SL privacy data for valid IMSI ueId', async () => {
      const response = await request(app)
        .get(`/nudm-sdm/v1/${validUeIdImsi}/rangingsl-privacy-data`)
        .expect(200)
        .expect('Content-Type', /json/);

      expect(response.body).to.have.property('rslppi');
      expect(response.body).to.have.property('rangingSlUnrelatedClass');
      expect(response.body).to.have.property('rangingSlPlmnOperatorClasses');
    });

    it('should retrieve ranging SL privacy data for NAI ueId format', async () => {
      const response = await request(app)
        .get(`/nudm-sdm/v1/${encodeURIComponent(validUeIdNai)}/rangingsl-privacy-data`)
        .expect(200);

      expect(response.body).to.have.property('rslppi');
      expect(response.body).to.have.property('rangingSlUnrelatedClass');
    });

    it('should retrieve ranging SL privacy data for MSISDN ueId format', async () => {
      const response = await request(app)
        .get(`/nudm-sdm/v1/${validUeIdMsisdn}/rangingsl-privacy-data`)
        .expect(200);

      expect(response.body).to.have.property('rslppi');
    });

    it('should retrieve ranging SL privacy data for EXTID ueId format', async () => {
      const response = await request(app)
        .get(`/nudm-sdm/v1/${validUeIdExtid}/rangingsl-privacy-data`)
        .expect(200);

      expect(response.body).to.have.property('rslppi');
    });

    it('should retrieve ranging SL privacy data for GCI ueId format', async () => {
      const response = await request(app)
        .get(`/nudm-sdm/v1/${validUeIdGci}/rangingsl-privacy-data`)
        .expect(200);

      expect(response.body).to.have.property('rslppi');
    });

    it('should retrieve ranging SL privacy data for GLI ueId format', async () => {
      const response = await request(app)
        .get(`/nudm-sdm/v1/${validUeIdGli}/rangingsl-privacy-data`)
        .expect(200);

      expect(response.body).to.have.property('rslppi');
    });

    it('should accept supported-features query parameter', async () => {
      const response = await request(app)
        .get(`/nudm-sdm/v1/${validUeIdImsi}/rangingsl-privacy-data`)
        .query({ 'supported-features': 'feature1' })
        .expect(200);

      expect(response.body).to.have.property('rslppi');
    });

    it('should include proper HTTP headers', async () => {
      const response = await request(app)
        .get(`/nudm-sdm/v1/${validUeIdImsi}/rangingsl-privacy-data`)
        .expect(200);

      expect(response.headers).to.have.property('cache-control');
      expect(response.headers).to.have.property('etag');
      expect(response.headers).to.have.property('last-modified');
    });
  });

  describe('Error cases', () => {
    it('should reject empty ueId', async () => {
      await request(app)
        .get('/nudm-sdm/v1//rangingsl-privacy-data')
        .expect(400);
    });
  });

  describe('Data structure validation', () => {
    it('should return properly structured ranging SL privacy data', async () => {
      const response = await request(app)
        .get(`/nudm-sdm/v1/${validUeIdImsi}/rangingsl-privacy-data`)
        .expect(200);

      expect(response.body).to.be.an('object');
      expect(response.body.rslppi).to.have.property('rangingSlPrivacyInd');
      expect(response.body.rslppi).to.have.property('validTimePeriod');
      expect(response.body.rangingSlUnrelatedClass).to.have.property('rangingSlDefaultUnrelatedClass');
      expect(response.body.rangingSlPlmnOperatorClasses).to.be.an('array');
    });

    it('should have valid time period with start and end time', async () => {
      const response = await request(app)
        .get(`/nudm-sdm/v1/${validUeIdImsi}/rangingsl-privacy-data`)
        .expect(200);

      expect(response.body.rslppi.validTimePeriod).to.have.property('startTime');
      expect(response.body.rslppi.validTimePeriod).to.have.property('endTime');
      expect(response.body.rslppi.validTimePeriod.startTime).to.be.a('string');
      expect(response.body.rslppi.validTimePeriod.endTime).to.be.a('string');
    });

    it('should return JSON content type', async () => {
      await request(app)
        .get(`/nudm-sdm/v1/${validUeIdImsi}/rangingsl-privacy-data`)
        .expect(200)
        .expect('Content-Type', /json/);
    });

    it('should return consistent data for same ueId', async () => {
      const response1 = await request(app)
        .get(`/nudm-sdm/v1/${validUeIdImsi}/rangingsl-privacy-data`)
        .expect(200);

      const response2 = await request(app)
        .get(`/nudm-sdm/v1/${validUeIdImsi}/rangingsl-privacy-data`)
        .expect(200);

      expect(response1.body).to.deep.equal(response2.body);
    });
  });
});
