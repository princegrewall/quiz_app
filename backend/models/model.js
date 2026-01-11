const { mongoose } = require('../db');

const submissionSchema = new mongoose.Schema({
  email: { type: String, required: true },
  score: { type: Number, default: 0 },
  answers: { type: Array, default: [] },
  meta: { type: Object, default: {} },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.models.Submission || mongoose.model('Submission', submissionSchema);
