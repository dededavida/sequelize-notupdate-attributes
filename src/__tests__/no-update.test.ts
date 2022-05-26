import { factory } from 'factory-girl';
import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Sequelize, Model } from 'sequelize';
import Chance from "chance";
import sequelizeNoUpdate from '../index';

const sequelize = new Sequelize('sqlite::memory:', {
  logging: false, // Disables logging
});

sequelizeNoUpdate(sequelize);

class Model_1 extends Model<InferAttributes<Model_1, {}>, InferCreationAttributes<Model_1, { omit: 'id' }>> {
  declare id: CreationOptional<number>;
  declare attr1: string;
  declare attr2: string;
  declare attr3: string;
}
Model_1.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  attr1: DataTypes.STRING,
  attr2: DataTypes.STRING,
  attr3: DataTypes.STRING,
}, {sequelize})

class Model_2 extends Model<InferAttributes<Model_2, {}>, InferCreationAttributes<Model_2, { omit: 'id' }>> {
  declare id: CreationOptional<number>;
  declare attr1: string;
  declare attr2: string;
  declare attr3: string;
}
Model_2.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  attr1: {
    type: DataTypes.STRING,
    noUpdate: true,
  },
  attr2: {
    type: DataTypes.STRING,
    noUpdate: false,
  },
  attr3: DataTypes.STRING,
}, { sequelize })

class Model_3 extends Model<InferAttributes<Model_3, {}>, InferCreationAttributes<Model_3, { omit: 'id' }>> {
  declare id: CreationOptional<number>;
  declare attr1: string;
  declare attr2: string;
  declare attr3: string;
}
Model_3.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  attr1: {
    type: DataTypes.STRING,
    noUpdate: {
      readOnly: true,
    },
  },
  attr2: {
    type: DataTypes.STRING,
    noUpdate: false,
  },
  attr3: DataTypes.STRING,
}, { sequelize })

const chance = new Chance();

factory.define('Model_1', Model_1, {
  attr1: chance.name(),
  attr2: chance.name(),
  attr3: chance.name(),
});
factory.define('Model_2', Model_2, {
  attr1: chance.name(),
  attr2: chance.name(),
  attr3: chance.name(),
});
factory.define('Model_3', Model_3, {
  attr1: chance.name(),
  attr2: chance.name(),
  attr3: chance.name(),
});

describe('if `noUpdate`', () => {
  beforeAll(() => {
    return sequelize.sync({
      force: true,
    });
  });

  describe('was not set', () => {
    it('should allow attributes modifications', async () => {
      const model_1 = await factory.create<Model_1>('Model_1');

      const response = model_1.update(
        { attr1: 'david' },
        {
          where: { id: model_1.id },
        }
      );

      await expect(response).resolves.toMatchObject(response);
    });
  });

  describe('was set', () => {
    it('should allow modifications on attributes without `noUpdate` set', async () => {
      const model_2 = await factory.create<Model_2>('Model_2');

      const response = model_2.update(
        { attr3: 'david' },
        {
          where: { id: model_2.id },
        }
      );

      await expect(response).resolves.toMatchObject(response);
    });
    it('should allow modifications on attributes with `noUpdate=false` set', async () => {
      const model_2 = await factory.create<Model_2>('Model_2');

      const response = model_2.update(
        { attr2: 'david' },
        {
          where: { id: model_2.id },
        }
      );

      await expect(response).resolves.toMatchObject(response);
    });
  });

  it('should not allow modifications on attributes with `noUpdate=true` set', async () => {
    const model_2 = await factory.create<Model_2>('Model_2');

    const response = model_2.update(
      { attr1: 'david' },
      {
        where: { id: model_2.id },
      }
    );

    await expect(response).rejects.toThrow(
      '`attr1` cannot be updated due `noUpdate` constraint'
    );
  });

  describe('and readonly was set', () => {
    it('should not allow modifications on attributes with `readOnly=true` set', async () => {
      const model_3 = await factory.create<Model_3>('Model_3');

      const response = model_3.update(
        { attr1: 'david' },
        {
          where: { id: model_3.id },
        }
      );

      await expect(response).rejects.toThrow(
        'attr1` cannot be updated due `noUpdate:readOnly` constraint'
      );
    });
  });
});
