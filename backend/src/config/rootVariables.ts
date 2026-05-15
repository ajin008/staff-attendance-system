const ENV = {
  get PORT() {
    return process.env.PORT || 8000;
  },
  get MONGO_URI() {
    return process.env.MONGO_URI as string;
  },
  get JWT_SECRET() {
    return process.env.JWT_SECRET as string;
  },
  get CLIENT_URL() {
    return process.env.CLIENT_URL as string;
  },
  get NODE_ENV() {
    return process.env.NODE_ENV || "development";
  },
};

export default ENV;
