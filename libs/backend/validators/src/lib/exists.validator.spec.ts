import { ValidationArguments } from 'class-validator';
import { ExistsConstraint } from './exists.validator';
import { Model } from 'sequelize-typescript';

class MockModel extends Model {
   findOne() {
    // Mock implementation of findOne method
  }
}

describe('Exists Validator', () => {
  let validator: ExistsConstraint;

  beforeEach(() => {
    validator = new ExistsConstraint();
  });

  it('should return true if value is null', async () => {
    const result = await validator.validate(null, { constraints: [MockModel, 'id'] } as ValidationArguments);
    expect(result).toBe(true);
  });

  it('should return false if record does not exist', async () => {
    MockModel.findOne = jest.fn().mockResolvedValueOnce(null);
    const result = await validator.validate(1, { constraints: [MockModel, 'id'] } as ValidationArguments);
    expect(result).toBe(false);
  });

  it('should return true if record exists', async () => {
    MockModel.findOne = jest.fn().mockResolvedValueOnce({});
    const result = await validator.validate(1, { constraints: [MockModel, 'id'] } as ValidationArguments);
    expect(result).toBe(true);
  });

  it('should return custom error message', () => {
    const defaultMessage = validator.defaultMessage();
    expect(defaultMessage).toEqual('Record does not exist');
  });

});
