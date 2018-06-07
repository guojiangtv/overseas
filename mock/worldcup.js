import Mock from 'mockjs';
Mock.mock('/worldcup/userinfo', {
    'errno': 0,
    'msg': '',
    'data': {
        'uid': 123,
        'nickname': 'ruby',
        'headPic': 'http://fpoimg.com/200x200',
        'gifts': {
            '67': 99, //用户送出的 大力神杯 礼物个数
            '68': 120 //用户送出的 T-shirt  礼物个数
        },
        'winCoins': 100, //用户抽奖收到的金币数
        'chance': 10 //用户拥有的抽奖次数
    }
});
Mock.mock('/worldcup/lottery', {
    'errno': 0,
    'msg': '',
    'data':{
        'result':{
            'level' : 1,     //奖品等级
            'prize' : 10      //奖励的金币数
        }
    }
});
Mock.mock('/worldcup/midrank', {
    'errno': 0,
    'msg': '',
    'data|10':[
        {
            'uid|+1'      : 123,
            'nickname' : 'ruby',
            'headPic'  : 'http://fpoimg.com/200x200',
            'rank'     : 1,        //用户排名
            'points|+1'   : 1000,     //用户积分
            'isPlay'   : 1,        //1:直播中 0：没有直播
            'isVip'    : 1,        //0:非VIP 1:VIP用户
            'isFollow' : 1         //0:未关注 1:已关注
        }
    ]
});
Mock.mock('/worldcup/userrank', {
    'errno': 0,
    'msg': '',
    'data|10':[
        {
            'uid|+1'      : 123,
            'nickname' : 'ruby',
            'headPic'  : 'http://fpoimg.com/200x200',
            'rank'     : 1,     //用户排名
            'points|+1'   : 1000,   //用户积分
            'isFollow|0-1' : 1       //0:未关注 1:已关注
        }
    ]
});
Mock.mock('/worldcup/love?mid=123', {
    'errno': 0,
    'msg': '',
    'data':{}
});
