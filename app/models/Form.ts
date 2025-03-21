import mongoose from 'mongoose';

const FormSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  formId: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  emailTo: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

const SubmissionSchema = new mongoose.Schema({
  formId: {
    type: String,
    required: true,
  },
  data: {
    type: Object,
    required: true,
  },
  submittedAt: {
    type: Date,
    default: Date.now,
  }
});

export const Form = mongoose.models.Form || mongoose.model('Form', FormSchema);
export const Submission = mongoose.models.Submission || mongoose.model('Submission', SubmissionSchema); 