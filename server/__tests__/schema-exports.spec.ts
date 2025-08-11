
import * as schema from '@shared/schema';

describe('Schema exports', () => {
  test('required schema exports exist', () => {
    expect(schema).toHaveProperty('contactSubmissions');
    expect(schema).toHaveProperty('users');
    expect(schema).toHaveProperty('organizations');
    expect(schema).toHaveProperty('orders');
    expect(schema).toHaveProperty('insertContactSubmissionSchema');
    expect(schema).toHaveProperty('insertOrderSchema');
    expect(schema).toHaveProperty('insertOrderItemSchema');
  });

  test('contact submission table has required columns', () => {
    const table = schema.contactSubmissions;
    expect(table).toBeDefined();
    
    // Check that the table structure includes expected columns
    expect(table.id).toBeDefined();
    expect(table.firstName).toBeDefined();
    expect(table.lastName).toBeDefined();
    expect(table.email).toBeDefined();
    expect(table.message).toBeDefined();
    expect(table.createdAt).toBeDefined();
  });

  test('validation schemas are properly defined', () => {
    const contactSchema = schema.insertContactSubmissionSchema;
    
    // Test valid data
    const validData = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      message: 'Test message'
    };
    
    expect(() => contactSchema.parse(validData)).not.toThrow();
    
    // Test invalid data
    const invalidData = {
      firstName: '',
      lastName: 'Doe',
      email: 'invalid-email',
      message: ''
    };
    
    expect(() => contactSchema.parse(invalidData)).toThrow();
  });
});
