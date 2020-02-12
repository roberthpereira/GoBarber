module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'users', // tabela na qual queremos add a coluna
      'avatar_id', // nome da coluna nova
      {
        type: Sequelize.INTEGER,
        // nome da tabela q queremos referenciar + o campo q queremos referenciar
        // todo avatar_id vai ser tbm o id da tabela files
        references: { model: 'files', key: 'id' },
        // caso o arquivo for apagado na tabela files:
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
        allowNull: true,
      }
    );
  },

  down: queryInterface => {
    return queryInterface.removeColumn('users', 'avatar_id');
  },
};
