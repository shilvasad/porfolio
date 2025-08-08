const mongoose = require('mongoose');

const ProfileSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    default: 'Your Name',
  },
  title: {
    type: String,
    required: true,
    default: 'Your Professional Title',
  },
  bio: {
    type: String,
    default: 'A short biography about yourself.',
  },
  profilePictureUrl: {
    type: String,
    default: 'https://via.placeholder.com/150',
  },
  socialLinks: {
    github: String,
    linkedin: String,
    twitter: String,
    personalSite: String,
  },
  contact: {
    email: String,
    phone: String,
  }
}, {
  // There should only ever be one profile, so we don't need timestamps
  // for creation/update of multiple documents. The update logic will handle this.
  timestamps: true
});

const Profile = mongoose.model('Profile', ProfileSchema);

module.exports = Profile;
