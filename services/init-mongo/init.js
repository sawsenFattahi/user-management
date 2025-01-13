db = db.getSiblingDB('lesechos'); // Switch to the lesechos database

db.createUser({
  user: 'lesechos',
  pwd: 'lesechos-password',
  roles: [
    {
      role: 'readWrite',
      db: 'lesechos', // The database to which the user is assigned
    },
  ],
});

print('Database and application user created successfully');
