const departmentSchema = new mongoose.Schema({
  name: String,
  description: String,
  parent: { type: mongoose.Schema.Types.ObjectId, ref: 'Department' }
});

module.exports = mongoose.model("Department", departmentSchema);