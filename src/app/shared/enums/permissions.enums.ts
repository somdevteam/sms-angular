export const Permissions = Object.freeze({
  userManagement: {
    roles: {
      CREATE_ROLE: 'createRole',
      UPDATE_ROLE: 'updateRole',
      VIEW_ROLE: 'viewRole',
    },
    users: {
      CREATE_USER: 'createUser',
      UPDATE_USER: 'updateUser',
      VIEW_USER: 'viewUser',
      VIEW_USER_PROFILE: 'viewUserProfile',
      RESET_PASSWORD: 'resetPassword',
    },
    loginHistories: {
      VIEW_LOGIN_HISTORY: 'viewLoginHistory',
    },
  },
  branchManagement: {
    branches: {
      CREATE_BRANCH: 'createBranch',
      UPDATE_BRANCH: 'updateBranch',
      VIEW_BRANCH: 'viewBranch',
    },
  },
});
