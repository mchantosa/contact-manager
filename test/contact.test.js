/* eslint-disable no-undef */
const Contact = require('../lib/contact');
const Objective = require('../lib/objective');

describe('Test: Contact', () => {
  describe('Test: Contact.makeContact()', () => {
    test('Test: Contact.makeContact() returns an empty contact with an empty objectives array', () => {
      const contact = Contact.makeContact();
      expect(contact instanceof Contact).toBe(true);
      expect(contact.objectives).toEqual([]);
      expect(contact.getEmailPretty()).toBe('none');
    });

    test('Test: Contact.makeContact(contactData, objectData) returns a contact with contact data and objectives containing objective data', () => {
      const contactData = { notes: 'Shiva bit me' };
      const objectiveData = [
        new Objective({ sillyData: 'I love my cat' }),
        new Objective({
          id: 1, // int
          contact_id: 1, // int
          occasion: 'birthday', // varchar(25)
          date_occasion: '1100-02-20', // date
          periodicity: 'weekly', // text
          date_next_contact: new Date(), // date
          date_last_contact: new Date('2022/11/03'), // date
          reminder: 'month', // text
        }),
      ];
      const contact = Contact.makeContact(contactData, objectiveData);
      expect(contact instanceof Contact).toBe(true);
      expect(contact.objectives[0] instanceof Objective).toBe(true);
      expect(contact.objectives[0].contact_id).toBe(contact.id);
      expect(contact.objectives[1].contact_id).toBe(contact.id);
      delete contact.objectives[0].contact_id;
      delete contact.objectives[1].contact_id;
      delete objectiveData[0].contact_id;
      delete objectiveData[1].contact_id;
      expect(contact.objectives).toEqual(objectiveData);
      expect(contact.getEmailPretty()).toBe('none');
      expect(contact.objectives[1].getOccasionDate()).toBe('02-20');
    });
  });

  test('Test: Contact.makeContact(contactData, objectData) propagates contact.id to contact objective,contact_id', () => {
    const contact = new Contact({ id: 5, notes: 'Shiva bit me' });
    const objectiveData = [
      new Objective({ sillyData: 'I love my cat' }),
      new Objective({
        id: 1, // int
        contact_id: 1, // int
        occasion: 'birthday', // varchar(25)
        date_occasion: '1100-02-20', // date
        periodicity: 'weekly', // text
        date_next_contact: new Date(), // date
        date_last_contact: new Date('2022/11/03'), // date
        reminder: 'month', // text
      }),
    ];
    contact.objectives = objectiveData;
    contact.mountObjectives();
    expect(contact instanceof Contact).toBe(true);
    expect(contact.objectives[0] instanceof Objective).toBe(true);
    expect(contact.objectives[0].contact_id).toBe(contact.id);
    expect(contact.objectives[1].contact_id).toBe(contact.id);
    delete contact.objectives[0].contact_id;
    delete contact.objectives[1].contact_id;
    delete objectiveData[0].contact_id;
    delete objectiveData[1].contact_id;
    expect(contact.objectives).toEqual(objectiveData);
    expect(contact.getEmailPretty()).toBe('none');
    expect(contact.objectives[1].getOccasionDate()).toBe('02-20');
  });
});

describe('Test Initialization', () => {
  test('Test: Falsy parameter initialization', () => {
    const contact = new Contact();
    expect(contact.mount).toBeDefined();
    expect(contact.mountObjectives).toBeDefined();
    expect(contact instanceof Contact).toBe(true);
    expect(contact.objectives).toEqual([]);
  });

  test('Test: Random parameter initialization', () => {
    const contact = new Contact({
      0: false,
      key1: '1',
      key2: 2,
      date: new Date('2000/02/03'),
      sum: (a, b) => a + b,
    });
    expect(contact[0]).toBe(false);
    expect(contact.key1).toBe('1');
    expect(contact.key2).toBe(2);
    expect(contact.date instanceof Date).toBe(true);
    expect(contact.sum(1, 'a')).toBe('1a');
  });

  test('Test: contactData parameter initialization', () => {
    const contact = new Contact({
      first_name: 'Shiva',
    });
    expect(contact.getName()).toBe('Shiva');
  });
});

describe('Test: mount(contactData) ', () => {
  test('Test: contact.mount(contactData) adds contactData fields to contact', () => {
    const contact = new Contact();
    const contactData = { notes: 'Shiva bit me' };
    contact.mount(contactData);
    expect(contact.notes).toBe('Shiva bit me');
  });

  test('Test: contact.mount(contactData), contactData is accessible to contact methods', () => {
    const contact = new Contact();
    const contactData = { notes: 'Shiva bit me' };
    contact.mount(contactData);
    expect(contact.getNotes()).toBe('Shiva bit me');
  });
});

describe('Test: mountObjectives(objectiveData) ', () => {
  test('Test: contact.mountObjectives() links a contact.id to objective.contact_id', () => {
    const contact = new Contact({
      id: 5,
    });
    contact.mountObjectives([{ test: 1 }, { Shiva: 'is naughty' }]);
    contact.objectives.forEach((objective) => {
      expect(objective.contact_id).toBe(5);
    });
  });

  test('Test: contact.mountObjectives(), if objectives are undefined, sets objectives to []', () => {
    const contact = new Contact();
    delete contact.objectives;
    contact.mountObjectives();
    expect(contact.objectives).toEqual([]);
  });

  test('Test: contact.mountObjectives() if objectives are defined, transforms objectiveData objectives into Objective objectives', () => {
    const contact = new Contact();
    delete contact.objectives;
    contact.objectives = [
      { sillyData: 'I love my cat' },
      {
        id: 1, // int
        contact_id: 1, // int
        occasion: 'birthday', // varchar(25)
        date_occasion: '1100-02-20', // date
        periodicity: 'weekly', // text
        date_next_contact: new Date(), // date
        date_last_contact: new Date('2022/11/03'), // date
        reminder: 'month', // text
      },
    ];
    contact.mountObjectives();
    const objectivesClassMatcher = [];
    contact.objectives.forEach((objective) => {
      objectivesClassMatcher.push(objective instanceof Objective);
    });
    expect(objectivesClassMatcher).toEqual([true, true]);
  });

  test('Test: contact.mountObjectives(objectiveData) transforms an array of objectiveData into an array of Objectives and then sets objectives to it', () => {
    const objectiveData = [
      { sillyData: 'I love my cat' },
      {
        id: 1, // int
        contact_id: 1, // int
        occasion: 'birthday', // varchar(25)
        date_occasion: '1100-02-20', // date
        periodicity: 'weekly', // text
        date_next_contact: new Date(), // date
        date_last_contact: new Date('2022/11/03'), // date
        reminder: 'month', // text
      },
    ];

    const contact = new Contact();
    delete contact.objectives;
    contact.mountObjectives(objectiveData);

    const objectivesClassMatcher = [];
    contact.objectives.forEach((objective) => {
      objectivesClassMatcher.push(objective instanceof Objective);
    });
    expect(objectivesClassMatcher).toEqual([true, true]);
  });

  test('Test: contact.mountObjectives(objectives) results in contact.objectives having objectives derived from objectives parameter', () => {
    const objectiveData = [
      new Objective({ sillyData: 'I love my cat' }),
      new Objective({
        id: 1, // int
        contact_id: 1, // int
        occasion: 'birthday', // varchar(25)
        date_occasion: '1100-02-20', // date
        periodicity: 'weekly', // text
        date_next_contact: new Date(), // date
        date_last_contact: new Date('2022/11/03'), // date
        reminder: 'month', // text
      }),
    ];

    const contact = new Contact();
    delete contact.objectives;
    contact.mountObjectives(objectiveData);

    const objectivesClassMatcher = [];
    contact.objectives.forEach((objective) => {
      objectivesClassMatcher.push(objective instanceof Objective);
    });
    expect(contact.objectives[0].sillyData).toBe('I love my cat');
    expect(contact.objectives[1].getOccasionDate()).toBe('02-20');
  });
});
