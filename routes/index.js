var express = require('express');
var router = express.Router();
const multer = require ('multer')
const mongoose = require('mongoose')
main().catch(err => console.log(err));

async function main() {
  // tai khaoan : mat khau
  // Products la ten cua database
  const db = 'mongodb+srv://thanhltph29166:0205@cluster0.5eefjzu.mongodb.net/'
  await mongoose.connect(db);
}

const CarModel
    = new mongoose.Schema({
  maXe : String,
  tenXe: String,
  giaXe : String,
  namSX : String,
  hinhAnh : [{ type: String }]

})
/* GET home page. */
router.get('/',async function(req, res, next) {
  const query = mongoose.model('Oto', CarModel, 'Oto')
  // Luu y truyen dung tham so, neu truyen sai thi mongoose tu tao ra collection theo tham so
  const data = await query.find()
  res.render('index', { title: 'Offical Ferrari Website', data : data, path: '/uploads/' });
});


const path = require("path");
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads'); // Duong dan luu tru file
  },
  // Tu dong dat ten anh la thoi gian hien tai + 1 so random
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
});
const upload = multer({
  storage: storage,
});



// So anh toi da mot lan load la 5 anh
const maxFileCount = 5;
router.post('/addCar', (req, res, next) => {
  upload.array('images', maxFileCount)(req, res, async function (err) {
    // Các xử lý lỗi như ở ví dụ trước

    // Kiểm tra xem có file nào được upload hay không
    if (!req.files || req.files.length === 0) {
      return res.status(400).send('Vui lòng chọn ít nhất một tập tin');
    }

    const maXe = req.body.maXe;
    const tenXe = req.body.tenXe;
    const giaXe = req.body.giaXe;
    const namSX = req.body.namSX;

    const hinhAnh = req.files.map(file =>file.originalname);
    console.log(hinhAnh)
    // Lấy đường dẫn ảnh từ các files upload và tạo mảng đường dẫn hình ảnh

    const query = mongoose.model('Oto', CarModel, 'Oto');
    await query.create({
      maXe: maXe,
      tenXe: tenXe,
      giaXe: giaXe,
      namSX: namSX,
      hinhAnh: hinhAnh, // Thêm các đường dẫn ảnh vào mảng hìnhAnh
    });

    res.redirect('/');
  });
});

router.get('/delete', async function (req,res){
  const maXe = req.query.maXe
  const query = mongoose.model('Oto', CarModel, 'Oto');
  await query.deleteOne({maXe:maXe})
  // Cap nhat lai danh sach sau khi xoa
  const data = await query.find()
  res.render('index', { title: 'Offical Ferrari Website', data : data, path: '/uploads/' });
})

router.post('/updateCar',async function (req,res){
  upload.array('imagesUpdate', maxFileCount)(req, res, async function (err) {
    // Các xử lý lỗi như ở ví dụ trước

    // Kiểm tra xem có file nào được upload hay không
    if (!req.files || req.files.length === 0) {
      return res.status(400).send('Vui lòng chọn ít nhất một tập tin');
    }

    const maXe = req.body.maXe;
    const tenXe = req.body.tenXe;
    const giaXe = req.body.giaXe;
    const namSX = req.body.namSX;
    const hinhAnh = req.files.map(file =>file.originalname);
    // Lấy đường dẫn ảnh từ các files upload và tạo mảng đường dẫn hình ảnh

    const query = mongoose.model('Oto', CarModel, 'Oto');
    await query.updateOne({maXe : maXe},{
      tenXe: tenXe,
      giaXe: giaXe,
      namSX: namSX,
      hinhAnh: hinhAnh, // Thêm các đường dẫn ảnh vào mảng hìnhAnh
    })
    res.redirect('/');
  });
})
module.exports = router;
