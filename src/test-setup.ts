import sinon from 'sinon';
import * as mongodb from './db/mongodb';

// In-memory storage for mock data
const mockStore: Map<string, any> = new Map();

// Mock MongoDB collection with stateful behavior
export const mockCollection = {
  insertOne: sinon.stub().callsFake(async (doc: any) => {
    const id = doc._id || 'mock-id';
    mockStore.set(id, { ...doc });
    return { insertedId: id };
  }),

  findOne: sinon.stub().callsFake(async (query: any) => {
    // Try to find by _id first
    if (query._id) {
      return mockStore.get(query._id) || null;
    }
    // Try to match other fields
    for (const [key, value] of mockStore.entries()) {
      let matches = true;
      for (const [qKey, qValue] of Object.entries(query)) {
        const docValue = value[qKey];
        // Handle array membership queries (MongoDB behavior)
        if (Array.isArray(docValue)) {
          if (!docValue.includes(qValue)) {
            matches = false;
            break;
          }
        } else if (docValue !== qValue) {
          matches = false;
          break;
        }
      }
      if (matches) {
        return value;
      }
    }
    return null;
  }),

  deleteOne: sinon.stub().callsFake(async (query: any) => {
    if (query._id && mockStore.has(query._id)) {
      mockStore.delete(query._id);
      return { deletedCount: 1 };
    }
    return { deletedCount: 0 };
  }),

  updateOne: sinon.stub().callsFake(async (query: any, update: any) => {
    if (query._id && mockStore.has(query._id)) {
      const existing = mockStore.get(query._id);
      if (update.$set) {
        Object.assign(existing, update.$set);
      }
      mockStore.set(query._id, existing);
      return { modifiedCount: 1 };
    }
    return { modifiedCount: 0 };
  }),

  findOneAndUpdate: sinon.stub().callsFake(async (query: any, update: any) => {
    if (query._id && mockStore.has(query._id)) {
      const existing = mockStore.get(query._id);
      if (update.$set) {
        Object.assign(existing, update.$set);
      }
      mockStore.set(query._id, existing);
      return { value: existing };
    }
    return { value: null };
  }),

  replaceOne: sinon.stub().callsFake(async (query: any, replacement: any) => {
    if (query._id && mockStore.has(query._id)) {
      mockStore.set(query._id, replacement);
      return { modifiedCount: 1, matchedCount: 1 };
    }
    return { modifiedCount: 0, matchedCount: 0 };
  })
};

// Mock getCollection to return our mock collection (done once globally)
sinon.stub(mongodb, 'getCollection').returns(mockCollection as any);

// Global beforeEach to reset stubs and clear store
beforeEach(() => {
  mockStore.clear();
  (mockCollection.insertOne as sinon.SinonStub).resetHistory();
  (mockCollection.findOne as sinon.SinonStub).resetHistory();
  (mockCollection.deleteOne as sinon.SinonStub).resetHistory();
  (mockCollection.updateOne as sinon.SinonStub).resetHistory();
  (mockCollection.findOneAndUpdate as sinon.SinonStub).resetHistory();
  (mockCollection.replaceOne as sinon.SinonStub).resetHistory();
});
