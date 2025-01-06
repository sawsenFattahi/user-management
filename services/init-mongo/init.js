db = db.getSiblingDB('lesechos');

db.createUser({
  user: 'lesechos',
  pwd: 'lesechos-password',
  roles: [
    {
      role: 'readWrite',
      db: 'lesechos',
    },
  ],
});

print('Database and application user created successfully');
