module.exports.todoSchema = {
  listTodo: {
    'complete': {
      in: ['query'],
      optional: true,
      isBoolean: {
        errorMessage: 'Wrong type must be use Boolean type!'
      }
    },
    'sorted_by': {
      in: ['query'],
      optional: true,
      isString: {
        errorMessage: 'must be use String type!'
      },
      isIn: {
        options: [['title', 'created_at']],
        errorMessage: 'no enum [title, created_at]'
      }
    },
    'sorted_order': {
      in: ['query'],
      optional: true,
      isString: {
        errorMessage: 'must be use String type!'
      },
      isIn: {
        options: [['asc', 'desc']],
        errorMessage: 'no enum [asc, desc]'
      }
    },
    'page': {
      in: ['query'],
      optional: true,
      isNumeric: {
        errorMessage: 'must be use Numeric type!'
      }
    },
    'limit': {
      in: ['query'],
      optional: true,
      isNumeric: {
        errorMessage: 'must be use Numeric type!'
      }
    }
  },
  createTodo: {
    'title': {
      in: ['body'],
      matches: {
        options: /^[\w\s\(\)\,\-\.]+$/i,
        errorMessage: 'must be use a-z or A-Z'
      }
    }
  },
  updateTodo: {
    'todo_id': {
      in: ['params'],
      isMongoId: {
        errorMessage: 'must be use MongoId type!'
      }
    },
    'title': {
      in: ['body'],
      optional: true,
      matches: {
        options: /^[\w\s\(\)\,\-\.]+$/i,
        errorMessage: 'must be use a-z or A-Z'
      }
    },
    'completed': {
      in: ['body'],
      optional: true,
      isBoolean: {
        errorMessage: 'must be use Boolean type!'
      }
    }
  },
  deleteTodo: {
    'todo_id': {
      in: ['params'],
      isMongoId: {
        errorMessage: 'must be use MongoID type!'
      }
    }
  }
}