export const corsOptions = {
  origin: ["http://localhost:3000", "https://kudoboard-api.onrender.com"],
  methods: "GET,POST, DELETE, PUT",
  allowedHeaders: ["Origin", "X-Requested-With", "Content-Type", "Accept"],
  credentials: true,
};
