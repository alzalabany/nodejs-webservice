const slug = require('slug')
const { Op } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  const Article = sequelize.define(
    'Article',
    {
      slug: {
        type: DataTypes.STRING,
        unique: {
          args: true,
          message: 'Slug must be unique.'
        },
        set(v) {
          this.setDataValue('slug', v.toLowerCase())
        }
      },
      title: DataTypes.STRING,
      description: DataTypes.STRING,
      body: DataTypes.STRING,
      favoritesCount: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        field: 'favorites_count'
      },
      tagList: {
        type: DataTypes.STRING,
        field: 'tag_list',
        set(v) {
          this.setDataValue('tagList', Array.isArray(v) ? v.join(',') + ',-' : '')
        },
        get() {
          const tagList = this.getDataValue('tagList')
          if (!tagList) return []
          return tagList.split(',').slice(0, -1)
        }
      }
    },
    {
      timestamps: true,
      underscored: true,
      tableName: 'articles',
      hooks: {
        beforeValidate: (article, options) => {
          if (!article.slug) {
            article.slug = slug(article.title) + '-' + ((Math.random() * Math.pow(36, 6)) | 0).toString(36)
          }
        }
      }
    }
  )

  Article.associate = function() {
    Article.belongsTo(sequelize.models.User, {
      onDelete: 'CASCADE',
      as: 'Author',
      foreignKey: {
        allowNull: false
      }
    })
    Article.hasMany(sequelize.models.Comment)
  }

  Article.prototype.updateFavoriteCount = function() {
    let article = this

    return sequelize.models.User.count({ where: { favorites: { [Op.in]: [article.id] } } }).then(function(count) {
      article.favoritesCount = count

      return article.save()
    })
  }

  Article.prototype.toJSONFor = function(author, user) {
    return {
      slug: this.slug,
      title: this.title,
      description: this.description,
      body: this.body,
      createdAt: this.created_at,
      updatedAt: this.updated_at,
      tagList: this.tagList,
      favorited: user ? user.isFavorite(this.id) : false,
      favoritesCount: this.favoritesCount,
      author: author.toProfileJSONFor(user)
    }
  }
  return Article
}
