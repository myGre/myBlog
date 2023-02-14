const express = require('express');
const AdminUser = require('../../models/AdminUser');
// const assert = require('http-assert');
const bcrypt = require('bcryptjs')
const JwtUtil = require('../../utils/jwt');

const router = express.Router({
  mergeParams: true,
})

/**
 * @api {post} /user/login 登录/注册
 * @apiName 登录/注册
 * @apiGroup user
 *
 * @apiParam {String} username 用户姓名
 * @apiParam {String} password 用户密码
 */
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  let userArr = {}
  userArr = await AdminUser.findOne({
    username,
  }).select('+password')
  // assert(user, 422, '用户名错误')
  // 没有账号自动注册
  if (!userArr) {
    userArr = await AdminUser.create({
      username: req.body.username,
      password: req.body.password,
    })
  }
  const isValid = bcrypt.compareSync(password, userArr.password)
  if (!isValid) {
    return res.status(422).send({
      msg: "密码错误, 请重新登录"
    })
  }
  AdminUser.updateOne({ _id: userArr._id }, { endLoginTime: Math.floor(Date.now() / 1000) }, (err, raw) => {
    console.log(raw)
  })

  // token加密userId
  let jwt = new JwtUtil(userArr._id);
  // 继承原型上的生成token方法
  let token = jwt.generateToken();
  res.send({
    code: 200,
    data: {
      token
    },
    msg: '登录成功'
  })
})

/**
 * @api {get} /user/info 获取用户信息
 * @apiName 获取用户信息
 * @apiGroup user
 *
 */
router.get('/info', async (req, res) => {
  const token = req.headers['token'];
  // token解码
  let jwt = new JwtUtil(token);
  let _id = jwt.verifyToken();
  const user = await AdminUser.findById({ _id });
  res.send({ code: 200, user });
})

/**
 * @api {post} /user/updatePassword 修改密码
 * @apiName 修改密码
 * @apiGroup user
 *
 * @apiParam {String} _id 用户id
 * @apiParam {String} password 新密码
 */
router.post('/updatePassword', (req, res) => {
  const { _id, password } = req.body;

  if (_id === '6340cb97cf058739b01512b7') return res.status(500).send({ msg: '配置失败，超级管理员禁止修改' })
  AdminUser.updateOne({ _id }, { password })
    .then((data) => {
      res.send({ code: 200, msg: '配置成功' })
    })
    .catch(() => {
      res.send({ code: 500, msg: '配置失败' })
    })
})

/**
 * @api {post} /user/del 删除单个账号
 * @apiName 删除单个账号
 * @apiGroup user
 *
 * @apiParam {String} _id 用户id
 */
router.post('/del', (req, res) => {
  const { _id, password } = req.body;

  if (_id === '6340cb97cf058739b01512b7') return res.status(500).send({ msg: '配置失败，超级管理员禁止修改' })
  AdminUser.findByIdAndRemove({ _id }, (err) => {
    if (!err) {
      res.send({
        code: 200,
        msg: '删除成功',
      })
    }
  })
})

/**
 * @api {post} /user/avatar 上传头像Url
 * @apiName 上传头像Url
 * @apiGroup user
 *
 * @apiParam {String} _id 用户id
 * @apiParam {String} avatar 图片路径
 */
router.post('/avatar', (req, res) => {
  const { _id, avatar } = req.body;
  AdminUser.findByIdAndUpdate({ _id }, { avatar }, {},
    (err, data) => {
      if (err) {
        console.log('上传失败');
        res.send({
          code: 500,
          msg: err
        })
      }
      if (data) {
        console.log('上传成功');
        res.send({
          code: 200,
          msg: '上传成功'
        })
      }
    })
})

/**
 * @api {post} /user/userList 获取普通用户列表信息
 * @apiName 获取普通用户列表信息
 * @apiGroup user
 *
 * @apiParam {Number} pageNo 页数
 * @apiParam {Number} pageSize 条数
 */
router.post('/userList', (req, res) => {
  const pageNo = Number(req.body.pageNo) || 1;
  const pageSize = Number(req.body.pageSize) || 10;
  const userData = {
    roleId: 2
  }
  // 正则方法
  const reg = new RegExp()
  // 计数
  AdminUser.countDocuments(userData, (err, count) => {
    if (err) {
      res.send({ code: 500, msg: "列表获取失败" });
      return
    }
    AdminUser.find(userData).skip(pageSize * (pageNo - 1)).limit(pageSize).sort('-createdAt').then(data => {
      // console.log('data', data)
      res.send({
        code: 200,
        data,
        total: count,
        pageNo: pageNo,
        pageSize: pageSize,
        msg: '列表获取成功',
      })
    })
      .catch(() => {
        res.send({ code: 500, msg: '列表获取失败' })
      });
  })
});

/**
 * @api {post} /user/add 新增用户
 * @apiName 新增用户
 * @apiGroup user
 *
 * @apiParam {String} username 用户名
 * @apiParam {String} password 密码
 * @apiParam {String}  avatar 头像url
 * @apiParam {String}  dosc 备注
 * @apiParam {Boolean} status 状态

 * 
 */
router.post('/add', (req, res) => {
  const { username, password, avatar, dosc } = req.body;
  AdminUser.create({ username, password, avatar, dosc },
    (err, data) => {
      if (err) {
        res.send({
          code: 500,
          msg: err
        })
      }
      if (data) {
        res.send({
          code: 200,
          msg: '新增成功'
        })
      }
    })
})

/**
 * @api {post} /user/update 修改用户信息
 * @apiName 修改用户信息
 * @apiGroup user
 *
 * @apiParam {String} _id 用户id
 * @apiParam {String} password 新密码
 * @apiParam {String} dosc 备注
 * @apiParam {String} avatar 头像url
 * @apiParam {Boolean} status 状态
 * 
 * 
 */
router.post('/update', (req, res) => {
  const { _id, password, dosc, avatar, status } = req.body;

  AdminUser.updateOne({ _id }, { password, dosc, avatar, status })
    .then((data) => {
      res.send({ code: 200, msg: '配置成功' })
    })
    .catch(() => {
      res.send({ code: 500, msg: '配置失败' })
    })
})

/**
 * @api {post} /user/adminList 获取普通用户列表信息
 * @apiName 获取普通用户列表信息
 * @apiGroup user
 *
 * @apiParam {Number} pageNo 页数
 * @apiParam {Number} pageSize 条数
 */
router.post('/adminList', (req, res) => {
  const pageNo = Number(req.body.pageNo) || 1;
  const pageSize = Number(req.body.pageSize) || 10;
  const userData = {
    roleId: 1
  }
  // 正则方法
  const reg = new RegExp()
  // 计数
  AdminUser.countDocuments(userData, (err, count) => {
    if (err) {
      res.send({ code: 500, msg: "列表获取失败" });
      return
    }
    AdminUser.find(userData).skip(pageSize * (pageNo - 1)).limit(pageSize).sort('-createdAt').then(data => {
      res.send({
        code: 200,
        data,
        total: count,
        pageNo: pageNo,
        pageSize: pageSize,
        msg: '列表获取成功',
      })
    })
      .catch(() => {
        res.send({ code: 500, msg: '列表获取失败' })
      });
  })
});
module.exports = router;