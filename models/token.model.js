module.exports = (sequelize, DataTypes) => {
  const OAuthToken = sequelize.define('OAuthToken', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    accessToken: {
      type: DataTypes.STRING,
      field: 'access_token',
      allowNull: false
    },
    accessTokenExpiresAt: {
      type: DataTypes.DATE,
      field: 'access_token_expires_at',
      allowNull: false
    },
    refreshToken: {
      type: DataTypes.STRING,
      field: 'refresh_token',
      allowNull: false
    },
    refreshTokenExpiresAt: {
      type: DataTypes.DATE,
      field: 'refresh_token_expires_at',
      allowNull: false
    },
    clientId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'client_id'
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'user_id'
    },
    createdAt: {
      type: DataTypes.DATE,
      field: 'created_at'
    },
    updatedAt: {
      type: DataTypes.DATE,
      field: 'updated_at'
    }
  }, {
    freezeTableName: true,
    timestamps: true
  });
  OAuthToken.associate = (models) => {
    OAuthToken.belongsTo(models.Client, {
      as: 'client',
      foreignKey: 'clientId',
      targetKey: 'id',
      onDelete: 'SET NULL'
    });
    OAuthToken.belongsTo(models.User, {
      as: 'user',
      foreignKey: 'userId',
      targetKey: 'id',
      onDelete: 'SET NULL'
    });
  };
  return OAuthToken;
};
