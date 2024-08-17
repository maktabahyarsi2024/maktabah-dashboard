const USER = {
  ADMIN: "admin",
  SUPER_ADMIN: "super admin",
};

export const accessUser = {
  viewer: [USER.SUPER_ADMIN],
  add: [USER.SUPER_ADMIN],
  edit: [USER.SUPER_ADMIN],
  delete: [USER.SUPER_ADMIN],
};
