import { expect } from 'chai';
import request from 'supertest';
import express from 'express';
import '../test-setup';
import { mockCollection } from '../test-setup';
import router from './nudm-mt';

const app = express();
app.use(express.json());
app.use('/nudm-mt/v1', router);

describe('GET /:supi - Happy Path', () => {
  const validSupi = 'imsi-123456789012345';

  it('should return UE info with single field tadsInfo', async () => {
    await mockCollection.insertOne({
      _id: validSupi,
      tadsInfo: {
        ueContextInfo: { accessType: '3GPP_ACCESS' }
      },
      userState: {
        accessType: '3GPP_ACCESS',
        registrationState: 'REGISTERED'
      },
      fiveGSrvccInfo: {
        ue5GSrvccCapability: true
      }
    });

    const response = await request(app)
      .get(`/nudm-mt/v1/${validSupi}`)
      .query({ fields: 'tadsInfo' })
      .expect(200)
      .expect('Content-Type', /json/);

    expect(response.body).to.have.property('tadsInfo');
    expect(response.body).to.not.have.property('userState');
    expect(response.body).to.not.have.property('fiveGSrvccInfo');
  });

  it('should return UE info with multiple fields', async () => {
    await mockCollection.insertOne({
      _id: validSupi,
      tadsInfo: {
        ueContextInfo: { accessType: '3GPP_ACCESS' }
      },
      userState: {
        accessType: '3GPP_ACCESS',
        registrationState: 'REGISTERED'
      },
      fiveGSrvccInfo: {
        ue5GSrvccCapability: true
      }
    });

    const response = await request(app)
      .get(`/nudm-mt/v1/${validSupi}`)
      .query({ fields: 'tadsInfo,userState,fiveGSrvccInfo' })
      .expect(200)
      .expect('Content-Type', /json/);

    expect(response.body).to.have.property('tadsInfo');
    expect(response.body).to.have.property('userState');
    expect(response.body).to.have.property('fiveGSrvccInfo');
  });

  it('should return userState field when requested', async () => {
    await mockCollection.insertOne({
      _id: validSupi,
      userState: {
        accessType: '3GPP_ACCESS',
        registrationState: 'REGISTERED'
      }
    });

    const response = await request(app)
      .get(`/nudm-mt/v1/${validSupi}`)
      .query({ fields: 'userState' })
      .expect(200);

    expect(response.body.userState).to.be.an('object');
    expect(response.body.userState).to.have.property('accessType');
    expect(response.body.userState).to.have.property('registrationState');
  });

  it('should accept nai format for supi', async () => {
    const naiSupi = 'nai-user@example.com';
    await mockCollection.insertOne({
      _id: naiSupi,
      tadsInfo: {
        ueContextInfo: { accessType: '3GPP_ACCESS' }
      }
    });

    const response = await request(app)
      .get(`/nudm-mt/v1/${naiSupi}`)
      .query({ fields: 'tadsInfo' })
      .expect(200);

    expect(response.body).to.have.property('tadsInfo');
  });

  it('should handle fields as array parameter', async () => {
    await mockCollection.insertOne({
      _id: validSupi,
      tadsInfo: {
        ueContextInfo: { accessType: '3GPP_ACCESS' }
      },
      userState: {
        accessType: '3GPP_ACCESS',
        registrationState: 'REGISTERED'
      }
    });

    const response = await request(app)
      .get(`/nudm-mt/v1/${validSupi}`)
      .query({ fields: ['tadsInfo', 'userState'] })
      .expect(200);

    expect(response.body).to.have.property('tadsInfo');
    expect(response.body).to.have.property('userState');
  });
});

describe('POST /:supi/loc-info/provide-loc-info - Happy Path', () => {
  const validSupi = 'imsi-123456789012345';

  it('should return location info when req5gsLoc is true', async () => {
    await mockCollection.insertOne({
      _id: validSupi,
      locationInfo: {
        vPlmnId: { mcc: '310', mnc: '410' },
        ncgi: {
          plmnId: { mcc: '310', mnc: '410' },
          nrCellId: '12345678'
        },
        tai: {
          plmnId: { mcc: '310', mnc: '410' },
          tac: 'A1B2'
        },
        currentLoc: true,
        ratType: 'NR',
        timezone: '+05:30',
        amfInstanceId: '550e8400-e29b-41d4-a716-446655440000'
      }
    });

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

  it('should return RAT type when reqRatType is true', async () => {
    await mockCollection.insertOne({
      _id: validSupi,
      locationInfo: {
        vPlmnId: { mcc: '310', mnc: '410' },
        ratType: 'NR'
      }
    });

    const response = await request(app)
      .post(`/nudm-mt/v1/${validSupi}/loc-info/provide-loc-info`)
      .send({ reqRatType: true })
      .expect(200);

    expect(response.body).to.have.property('ratType', 'NR');
  });

  it('should return timezone when reqTimeZone is true', async () => {
    await mockCollection.insertOne({
      _id: validSupi,
      locationInfo: {
        vPlmnId: { mcc: '310', mnc: '410' },
        timezone: '+05:30'
      }
    });

    const response = await request(app)
      .post(`/nudm-mt/v1/${validSupi}/loc-info/provide-loc-info`)
      .send({ reqTimeZone: true })
      .expect(200);

    expect(response.body).to.have.property('timezone');
  });

  it('should return serving node info when reqServingNode is true', async () => {
    await mockCollection.insertOne({
      _id: validSupi,
      locationInfo: {
        vPlmnId: { mcc: '310', mnc: '410' },
        amfInstanceId: '550e8400-e29b-41d4-a716-446655440000'
      }
    });

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
    await mockCollection.insertOne({
      _id: validSupi,
      locationInfo: {
        vPlmnId: { mcc: '310', mnc: '410' },
        ncgi: {
          plmnId: { mcc: '310', mnc: '410' },
          nrCellId: '12345678'
        },
        tai: {
          plmnId: { mcc: '310', mnc: '410' },
          tac: 'A1B2'
        },
        currentLoc: true,
        ratType: 'NR',
        timezone: '+05:30',
        amfInstanceId: '550e8400-e29b-41d4-a716-446655440000'
      }
    });

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

  it('should include supportedFeatures when provided', async () => {
    await mockCollection.insertOne({
      _id: validSupi,
      locationInfo: {
        vPlmnId: { mcc: '310', mnc: '410' },
        ncgi: {
          plmnId: { mcc: '310', mnc: '410' },
          nrCellId: '12345678'
        },
        tai: {
          plmnId: { mcc: '310', mnc: '410' },
          tac: 'A1B2'
        },
        currentLoc: true
      }
    });

    const response = await request(app)
      .post(`/nudm-mt/v1/${validSupi}/loc-info/provide-loc-info`)
      .send({
        req5gsLoc: true,
        supportedFeatures: 'ABC123'
      })
      .expect(200);

    expect(response.body).to.have.property('supportedFeatures', 'ABC123');
  });

  it('should accept nai format for supi', async () => {
    const naiSupi = 'nai-user@example.com';
    await mockCollection.insertOne({
      _id: naiSupi,
      locationInfo: {
        vPlmnId: { mcc: '310', mnc: '410' },
        ncgi: {
          plmnId: { mcc: '310', mnc: '410' },
          nrCellId: '12345678'
        },
        tai: {
          plmnId: { mcc: '310', mnc: '410' },
          tac: 'A1B2'
        }
      }
    });

    const response = await request(app)
      .post(`/nudm-mt/v1/${naiSupi}/loc-info/provide-loc-info`)
      .send({ req5gsLoc: true })
      .expect(200);

    expect(response.body).to.have.property('ncgi');
  });

  it('should handle empty request body with default values', async () => {
    await mockCollection.insertOne({
      _id: validSupi,
      locationInfo: {
        vPlmnId: { mcc: '310', mnc: '410' }
      }
    });

    const response = await request(app)
      .post(`/nudm-mt/v1/${validSupi}/loc-info/provide-loc-info`)
      .send({})
      .expect(200);

    expect(response.body).to.be.an('object');
    expect(response.body).to.have.property('vPlmnId');
  });
});

