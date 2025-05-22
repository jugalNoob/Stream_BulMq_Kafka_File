cqrs-app/
│
├── command/                  # All write operations (mutations)
│   ├── taskCommandHandler.js
│   └── userCommandHandler.js
│
├── query/                    # All read operations (queries)
│   ├── taskQueryHandler.js
│   └── userQueryHandler.js
│
├── models/                   # Mongoose models
│   ├── task.js
│   └── user.js
│
├── routes/                   # Express routes
│   ├── taskRoutes.js
│   └── userRoutes.js
│
├── config/                   # DB and other configuration
│   └── db.js
│
├── server.js                 # Main app entry point
└── package.json
