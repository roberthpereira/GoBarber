import Sequelize, { Model } from 'sequelize';
import bcrypt from 'bcryptjs';

class User extends Model {
  static init(sequelize) {
    super.init(
      {
        // os campos abaixo não precisam ser um reflexo dos campos da BD
        name: Sequelize.STRING,
        email: Sequelize.STRING,
        password: Sequelize.VIRTUAL, // Virtual: nunca vai existir na BD
        password_hash: Sequelize.STRING,
        provider: Sequelize.BOOLEAN,
      },
      {
        sequelize,
      }
    );

    // Hooks: Trexos de cod executadaos de forma automatica baseada em ações dos models
    this.addHook('beforeSave', async user => {
      // beforeSave: executa antes dos dados serem salvos na bd
      if (user.password) {
        // atribuição do password apos ser criptografado ao password_hash
        user.password_hash = await bcrypt.hash(user.password, 8);
      }
    });

    return this;
  }

  static associate(models) {
    // Model User atual pertence ao model File (teremos um campo de File no nosso model)
    this.belongsTo(models.File, { foreignKey: 'avatar_id', as: 'avatar' });
  }

  checkPassword(password) {
    // compara a senha q o user ta tentando logar com a senha criptografada da bd
    return bcrypt.compare(password, this.password_hash);
  }
}

export default User;
