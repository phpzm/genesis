/**
 * @param {Object} user
 * @returns {*}
 */
export default (user) => {
  /*
   * Configure the property permissions to access control
   * Example:
   * permissions: {
   *   namespaces: {
   *     permission: [1 to 4]
   *   }
   * }
   */

  return {
    institution: user['ist_nome'],
    user: user['usr_login'],
    name: user['usr_nome'],
    profile: user['usr_perfil']
  }
}
