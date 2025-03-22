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
  active: {
    type: Boolean,
    default: true,
  },
  settings: {
    honeypot: {
      type: Boolean,
      default: false,
    },
    dataRetention: {
      type: String,
      default: 'forever',
    },
    emailNotifications: {
      type: Boolean,
      default: true,
    },
    notificationEmail: {
      type: String,
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  }
});

const SubmissionSchema = new mongoose.Schema({
  formId: {
    type: String,
    required: true,
    index: true
  },
  data: {
    type: Object,
    required: true
  },
  submittedAt: {
    type: Date,
    default: Date.now,
    index: true
  },
  ip: String,
  userAgent: String,
  referrer: String,
  isSpam: {
    type: Boolean,
    default: false
  }
});

// Add compound index for pagination queries
SubmissionSchema.index({ formId: 1, submittedAt: -1 });

export const Form = mongoose.models.Form || mongoose.model('Form', FormSchema);
export const Submission = mongoose.models.Submission || mongoose.model('Submission', SubmissionSchema); 