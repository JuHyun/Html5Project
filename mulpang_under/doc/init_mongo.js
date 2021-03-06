var clog = require("clog");
clog.info("DB 초기화 시작...");
var Mongolian = require("mongolian");
var server = new Mongolian;

clog.configure({"log level": 2});

var db = server.db("mulpang");
clog.info("DB 접속 완료.");

// _id 컬럼에서 사용할 ObjectId 객체
var ObjectId = Mongolian.ObjectId;

// 컬렉션 지정
db.member = db.collection("member");
db.shop = db.collection("shop");
db.coupon = db.collection("coupon");
db.purchase = db.collection("purchase");
db.epilogue = db.collection("epilogue");


// 현재 DB 삭제
db.runCommand({dropDatabase: 1});


// 아이디 값을 미리 생성한다.
shopObjId = [];
for(var i=0; i<5; i++){
	shopObjId[i] = new ObjectId();
}

couponObjId = [];
for(var i=0; i<20; i++){
	couponObjId[i] = new ObjectId();
}

// 오늘
var now = new Date();

// 1. 회원 데이터 등록
registMember();

// 회원 데이터 등록
function registMember(){
	var members = [
		{
			_id: "uzoolove@gmail.com", 
			password: "uzoolove", 
			profileImage: "member/uzoolove@gmail.com.jpg",
			regDate: now
		},
		{
			_id: "seulbinim@gmail.com", 
			password: "seulbinim", 
			profileImage: "member/seulbinim@gmail.com.jpg",
			regDate: now
		},
		{
			_id: "test", 
			password: "test", 
			profileImage: "member/test.jpg",
			regDate: now
		}
	];
	
	// 2. 회원 데이터 등록 완료 시 업체 데이터 등록
	clog.debug("1. 회원 등록 완료.");
	db.member.insert(members, registShop);
}

// 업체 데이터 등록
function registShop(){
	var shops = [
		{
			_id: shopObjId[0],
			shopName: "을지로 골뱅이", 
			tel: "02-111-2222", 
			region: "강남",
			address: "서울특별시 강남구 역삼2동 718-1", 
			officeHours: {open: "14:00", close: "24:00"}, 
			homepage: "www.multicampus.co.kr", 
			email: "master@multicampus.co.kr",
			shopDesc: "골뱅이는 역시 을지로 골뱅이.", 
			dayoff: "매주 일요일", 
			position: {lat: 37.501025, lng: 127.038866},
			directions: "역삼역 1번 출구에서 직진으로 100m 오시면 좌측에 을지로 골뱅이 간판이 보입니다.",
			etc: "기타 정보 없음.",
			couponQuantity: 1,
			picture: {file: "shop/shop_01.jpg", desc: "을지로 골뱅이 외부 모습"}
		},
		{
			_id: shopObjId[1],
			shopName: "스타벅스 압구정", 
			tel: "02-222-3333",
			region: "압구정",
			address: "서울특별시 강남구 신사동 639-7", 
			officeHours: {open: "10:00", close: "22:00"}, 
			homepage: "http://www.istarbucks.co.kr", 
			email: "star@naver.com",
			shopDesc: "스타벅스 압구정 지점입니다.", 
			dayoff: "연중 무휴", 
			position: {lat: 37.528085, lng: 127.036479},	
			directions: "압구정역 3번 출구로 나와서 30m 걸어오신 후 첫번째 골목에서 20m 들어가면 간판이 보입니다.",
			etc: "압구정 최고의 스타벅스입니다.",
			couponQuantity: 1,
			picture: {file: "shop/shop_02.jpg", desc: "스타벅스 압구정 전경"}
		},
		{
			_id: shopObjId[2],
			shopName: "투썸플레이스 압구정 51K점", 
			tel: "02-444-5555",
			region: "압구정",
			address: "서울특별시 강남구 신사동 602", 
			officeHours: {open: "10:00", close: "22:00"}, 
			homepage: "http://www.twosome.co.kr/main.asp", 
			email: "two@naver.com",
			shopDesc: "스타일리쉬 '소간지' 공간. 매장 곳곳 배우 소지섭의 섬세한 감각이 당신에게 특별한 가치를 선물합니다.", 
			dayoff: "연중 무휴", 
			position: {lat: 37.524207, lng: 127.029446},
			directions: "압구정역 3번 출구에 위치한 CGV 압구정 신관 1층",
			etc: "'투썸 플레이스 by 51K'에는 배우 소지섭이 직접 기획부터 참여하고, 적극적인 아이디어 제안으로 만들어진 51K점 만의 특별한 메뉴가 있습니다.",
			couponQuantity: 1,
			picture: {file: "shop/shop_03.jpg", desc: "투썸 플레이스 압구정 전경"}
		}	     
	];
	
	// 3. 업체 데이터 등록 완료 시 쿠폰 데이터 등록
	clog.debug("2. 업체 등록 완료.");
	db.shop.insert(shops, registCoupon);
}

// 쿠폰 데이터 등록
function registCoupon(){
	
	db.shop.find().toArray(function(err, shops){
		shopObjId = shops;
		var coupons = [
       		{
       			_id: couponObjId[0],
       			shopId: shopObjId[0]._id, 
       			region: shopObjId[0].region,
       			position: {lat: 37.501032, log: 127.038884},
       			couponName: "물냉면", 
       			primeCost: 8000, 
       			price: 6000, 
       			quantity: 100, 
       			saleDate: {start: new Date(now*1-1000*60*60*24*2), finish: new Date(now*1+1000*60*60*24*10)}, 
       			useDate: {start: new Date(now*1-1000*60*60*24*2), finish: new Date(now*1+1000*60*60*24*30)}, 
       			image: {main: {file: "photo/coupon_01.jpg", desc: "물냉면 메인 이미지"}, detail: {file: "photo/coupon_01_detail.jpg", desc: "물냉면 상세 이미지"}, etc: []}, 
       			desc: "맛있는 물냉이 6000원", 
       			comment: "한 테이블에 하나만 사용 가능.", 
       			buyQuantity: 90, 
       			regDate: new Date(now*1-1000*60*60*24*3),
       			epilogueCount: 7,
       			viewCount: 50,
       			satisfactionAvg: 3.54354353
       		},
       		{
       			_id: couponObjId[1],
       			shopId: shopObjId[1]._id, 
       			region: shopObjId[1].region,
       			position: {lat: 37.525656, lng: 127.027464},
       			couponName: "아이스크림 와플 세트", 
       			primeCost: 16000, 
       			price: 12000, 
       			quantity: 200, 
       			saleDate: {start: new Date(now*1-1000*60*60*24*10), finish: new Date(now*1+1000*60*60*24*20)}, 
       			useDate: {start: new Date(now*1+1000*60*60*24*3), finish: new Date(now*1+1000*60*60*24*33)}, 
       			image: {main: {file: "photo/coupon_02.jpg", desc: "와플 메인 이미지"}, detail: {file: "photo/coupon_02_detail.jpg", desc: "와플 상세 이미지"}, etc: [{file: "photo/coupon_02_0.jpg", desc: "추억의 폴라로이드 사진"}, {file: "photo/coupon_02_1.jpg", desc: "라떼아트"}, {file: "photo/coupon_02_2.jpg", desc: "맛있는 쿠키"}, {file: "photo/coupon_02_3.jpg", desc: "팥빙수"}]}, 
       			video: {src: "waffle.mp4", poster: "waffle.jpg", desc: "와플 홍보 동영상"},
       			desc: "와플과 아이스크림 세트가 12000원", 
       			comment: "무제한 사용 가능.", 
       			buyQuantity: 29, 
       			regDate: new Date(now*1-1000*60*60*24*10),
       			epilogueCount: 38,
       			viewCount: 45,
       			satisfactionAvg: 2.435345
       		},
       		{
       			_id: couponObjId[2],
       			shopId: shopObjId[0]._id, 
       			region: shopObjId[0].region,
       			position: {lat: 37.503811, lng: 127.025809},
       			couponName: "고려 삼계탕", 
       			primeCost: 13000, 
       			price: 10000, 
       			quantity: 1000, 
       			saleDate: {start: new Date(now*1+1000*60*60*24*1), finish: new Date(now*1+1000*60*60*24*3)}, 
       			useDate: {start: new Date(now*1+1000*60*60*24*2), finish: new Date(now*1+1000*60*60*24*3)}, 
       			image: {main: {file: "photo/coupon_03.jpg", desc: "삼계탕 메인 이미지"}, detail: {file: "photo/coupon_03_detail.jpg", desc: "삼계탕 상세 이미지"}, etc: []}, 
       			desc: "더위를 잊기위한 필수 보양식!", 
       			comment: "한 테이블에 하나만 사용 가능.", 
       			buyQuantity: 38, 
       			regDate: new Date(now*1-1000*60*60*24*5),
       			epilogueCount: 560,
       			viewCount: 23,
       			satisfactionAvg: 3.5345435
       		},
       		{
       			_id: couponObjId[3],
       			shopId: shopObjId[0]._id, 
       			region: shopObjId[0].region,
       			position: {lat: 37.348207, lng: 126.688966},
       			couponName: "눈물의 해물 파전", 
       			primeCost: 11000, 
       			price: 9000, 
       			quantity: 100, 
       			saleDate: {start: new Date(now*1+1000*60*60*24*1), finish: new Date(now*1+1000*60*60*24*3)}, 
       			useDate: {start: new Date(now*1+1000*60*60*24*3), finish: new Date(now*1+1000*60*60*24*33)}, 
       			image: {main: {file: "photo/coupon_04.jpg", desc: "파전 메인 이미지"}, detail: {file: "photo/coupon_04_detail.jpg", desc: "파전 상세 이미지"}, etc: []}, 
       			desc: "눈물 없이는 먹을수 없는 해물파전을 단돈 9000원에 모십니다.", 
       			comment: "한 테이블에 하나만 사용 가능. 타 쿠폰과 중복 사용 불가", 
       			buyQuantity: 27, 
       			regDate: new Date(now*1-1000*60*60*24*3),
       			epilogueCount: 17,
       			viewCount: 44,
       			satisfactionAvg: 2.9896776
       		},
       		{
       			_id: couponObjId[4],
       			shopId: shopObjId[0]._id, 
       			region: shopObjId[0].region,
       			position: {lat: 37.503053, lng: 127.038812},
       			couponName: "자연산 활어회", 
       			primeCost: 52000, 
       			price: 35000, 
       			quantity: 30, 
       			saleDate: {start: new Date(now*1-1000*60*60*24*30), finish: new Date(now*1-1000*60*60*24*5)}, 
       			useDate: {start: new Date(now*1-1000*60*60*24*30), finish: new Date(now*1-1000*60*60*24)}, 
       			image: {main: {file: "photo/coupon_05.jpg", desc: "활어회 메인 이미지"}, detail: {file: "photo/coupon_05_detail.jpg", desc: "활어회 상세 이미지"}, etc: []}, 
       			desc: "직접 잡은 자연산 활어회를 싼 가격에 드립니다.", 
       			comment: "한 테이블에 하나만 사용 가능.", 
       			buyQuantity: 16, 
       			regDate: new Date(now*1-1000*60*60*24*30),
       			epilogueCount: 67,
       			viewCount: 24,
       			satisfactionAvg: 3.123213
       		},
       		{
       			_id: couponObjId[5],
       			shopId: shopObjId[0]._id, 
       			region: shopObjId[0].region,
       			position: {lat: 37.501102, lng: 127.040268},
       			couponName: "그라제 버거", 
       			primeCost: 8000, 
       			price: 6400, 
       			quantity: 500, 
       			saleDate: {start: new Date(now*1-1000*60*60*24*10), finish: new Date(now*1+1000*60*60*24*2)}, 
       			useDate: {start: new Date(now*1+1000*60*60*24*1), finish: new Date(now*1+1000*60*60*24*3)}, 
       			image: {main: {file: "photo/coupon_06.jpg", desc: "그라제 버거 메인 이미지"}, detail: {file: "photo/coupon_06_detail.jpg", desc: "그라제 버거 상세 이미지"}, etc: []}, 
       			desc: "수제 햄거버의 명문!!! 그라제 버거. 20% 할인된 가격으로 만나보세요.", 
       			comment: "한 테이블에 하나만 사용 가능. 런치에만 사용 가능.", 
       			buyQuantity: 203, 
       			regDate: new Date(now*1-1000*60*60*24*10),
       			epilogueCount: 106,
       			viewCount: 255,
       			satisfactionAvg: 4.56432
       		},
       		{
       			_id: couponObjId[6],
       			shopId: shopObjId[1]._id, 
       			region: shopObjId[1].region,
       			position: {lat: 37.498627, lng: 126.99955},
       			couponName: "베스킨 라빈스", 
       			primeCost: 13500, 
       			price: 10000, 
       			quantity: 99, 
       			saleDate: {start: new Date(now*1-1000*60*60*24*5), finish: new Date(now*1+1000*60*60*24*2)}, 
       			useDate: {start: new Date(now*1+1000*60*60*24*4), finish: new Date(now*1+1000*60*60*24*30)}, 
       			image: {main: {file: "photo/coupon_07.jpg", desc: "베스킨 라빈스 싱글콘"}, detail: {file: "photo/coupon_07_detail.jpg", desc: "베스킨 라빈스 싱글콘 상세 이미지"}, etc: []}, 
       			desc: "32가지 아이스크림 중에서 싱글콘 선택이 가능", 
       			comment: "할인 쿠폰과 중복 사용 불가능.", 
       			buyQuantity: 80, 
       			regDate: new Date(now*1-1000*60*60*24*10),
       			epilogueCount: 90,
       			viewCount: 34,
       			satisfactionAvg: 3.5
       		},
       		{
       			_id: couponObjId[7],
       			shopId: shopObjId[0]._id, 
       			region: shopObjId[0].region,
       			position: {lat: 37.489706, lng: 127.011652},
       			couponName: "병맥주페스티벌", 
       			primeCost: 25000, 
       			price: 20000, 
       			quantity: 45, 
       			saleDate: {start: new Date(now*1-1000*60*60*24*15), finish: new Date(now*1+1000*60*60*24*3)}, 
       			useDate: {start: new Date(now*1+1000*60*60*24*10), finish: new Date(now*1+1000*60*60*24*10)}, 
       			image: {main: {file: "photo/coupon_08.jpg", desc: "수입맥주와 안주세트"}, detail: {file: "photo/coupon_08_detail.jpg", desc: "수입맥주와 안주세트 상세 이미지"}, etc: []}, 
       			desc: "수입맥주 중 아무거나 5병 구매시 1병 추가제공", 
       			comment: "할인 쿠폰과 중복 사용 불가능.", 
       			buyQuantity: 0, 
       			regDate: new Date(now*1-1000*60*60*24*10),
       			epilogueCount: 23,
       			viewCount: 21,
       			satisfactionAvg: 3.6785
       		},
       		{
       			_id: couponObjId[8],
       			shopId: shopObjId[1]._id, 
       			region: shopObjId[1].region,
       			position: {lat: 37.484939, lng: 126.98307},
       			couponName: "카페라떼", 
       			primeCost: 5000, 
       			price: 3000, 
       			quantity: 10, 
       			saleDate: {start: new Date(now*1-1000*60*60*24*8), finish: new Date(now*1-1000*60*60*24*5)}, 
       			useDate: {start: new Date(now*1+1000*60*60*24*5), finish: new Date(now*1+1000*60*60*24*30)}, 
       			image: {main: {file: "photo/coupon_09.jpg", desc: "카페라떼"}, detail: {file: "photo/coupon_09_detail.jpg", desc: "카페라떼 상세 이미지"}, etc: []}, 
       			desc: "고급원두를 사용한 카페라떼를 저렴한 가격에 제공", 
       			comment: "아이스로 주문 시 500원 추가.", 
       			buyQuantity: 10, 
       			regDate: new Date(now*1-1000*60*60*24*10),
       			epilogueCount: 55,
       			viewCount: 110,
       			satisfactionAvg: 4.87654
       		},
       		{
       			_id: couponObjId[9],
       			shopId: shopObjId[0]._id, 
       			region: shopObjId[0].region,
       			position: {lat: 37.488072, lng: 126.969423},
       			couponName: "일말에 스파게티", 
       			primeCost: 15000, 
       			price: 9000, 
       			quantity: 27, 
       			saleDate: {start: new Date(now*1-1000*60*60*24*17), finish: new Date(now*1+1000*60*60*24*10)}, 
       			useDate: {start: new Date(now*1+1000*60*60*24*10), finish: new Date(now*1+1000*60*60*24*30)}, 
       			image: {main: {file: "photo/coupon_10.jpg", desc: "일말에 스파게티"}, detail: {file: "photo/coupon_10_detail.jpg", desc: "일말에 스파게티 상세 이미지"}, etc: []}, 
       			desc: "일말에 스파게티 자유쿠폰", 
       			comment: "토마토 또는 크림 스파게티 메뉴만 사용 가능", 
       			buyQuantity: 17, 
       			regDate: new Date(now*1-1000*60*60*24*10),
       			epilogueCount: 45,
       			viewCount: 6,
       			satisfactionAvg: 3.34532
       		},
       		{
       			_id: couponObjId[10],
       			shopId: shopObjId[1]._id, 
       			region: shopObjId[1].region,
       			position: {lat: 37.47949, lng: 127.005987},
       			couponName: "허브 삼겹살", 
       			primeCost: 11000, 
       			price: 5500, 
       			quantity: 120, 
       			saleDate: {start: new Date(now*1-1000*60*60*24*10), finish: new Date(now*1+1000*60*60*24*4)}, 
       			useDate: {start: new Date(now*1+1000*60*60*24*7), finish: new Date(now*1+1000*60*60*24*10)}, 
       			image: {main: {file: "photo/coupon_11.jpg", desc: "허브 삼겹살"}, detail: {file: "photo/coupon_11_detail.jpg", desc: "허브 삼겹살 상세 이미지"}, etc: []}, 
       			desc: "허브 삼겹살 반값쿠폰", 
       			comment: "1인당 10매까지만 구입가능", 
       			buyQuantity: 30, 
       			regDate: new Date(now*1-1000*60*60*24*10),
       			epilogueCount: 3,
       			viewCount: 21,
       			satisfactionAvg: 4.23421
       		},
       		{
       			_id: couponObjId[11],
       			shopId: shopObjId[0]._id, 
       			region: shopObjId[0].region,
       			position: {lat: 37.507819, lng: 126.997576},
       			couponName: "널부 쭈꾸미", 
       			primeCost: 28000, 
       			price: 15000, 
       			quantity: 75, 
       			saleDate: {start: new Date(now*1-1000*60*60*24*8), finish: new Date(now*1+1000*60*60*24*4)}, 
       			useDate: {start: new Date(now*1+1000*60*60*24*5), finish: new Date(now*1+1000*60*60*24*15)}, 
       			image: {main: {file: "photo/coupon_12.jpg", desc: "널부 쭈꾸미"}, detail: {file: "photo/coupon_12_detail.jpg", desc: "널부 쭈꾸미 상세 이미지"}, etc: []}, 
       			desc: "널부에서 매콤한 쭈꾸미 볶음을 저렴한 가격에 구입할 수 있는 절호의 찬스", 
       			comment: "점심시간(12시부터 1시까지)에는 사용 불가능", 
       			buyQuantity: 65, 
       			regDate: new Date(now*1-1000*60*60*24*10),
       			epilogueCount: 27,
       			viewCount: 12,
       			satisfactionAvg: 3.43522
       		},
       		{
       			_id: couponObjId[12],
       			shopId: shopObjId[1]._id, 
       			region: shopObjId[1].region,
       			position: {lat: 37.505028, lng: 127.010021},
       			couponName: "소울 감자탕", 
       			primeCost: 35000, 
       			price: 20000, 
       			quantity: 50, 
       			saleDate: {start: new Date(now*1-1000*60*60*24*18), finish: new Date(now*1+1000*60*60*24*3)}, 
       			useDate: {start: new Date(now*1+1000*60*60*24*15), finish: new Date(now*1+1000*60*60*24*30)}, 
       			image: {main: {file: "photo/coupon_13.jpg", desc: "소울 감자탕"}, detail: {file: "photo/coupon_13_detail.jpg", desc: "소울 감자탕 상세 이미지"}, etc: []}, 
       			desc: "감자탕의 전설. 이제 소울에서 만날 수 있습니다. 소중한 친구와 소울 감자탕에서 정겨운 시간을 보내시기 바랍니다. 구매해 주셔서 감사합니다.", 
       			comment: "1테이블 1매만 사용 가능", 
       			buyQuantity: 50, 
       			regDate: new Date(now*1-1000*60*60*24*10),
       			epilogueCount: 6,
       			viewCount: 14,
       			satisfactionAvg: 3.45645
       		},
       		{
       			_id: couponObjId[13],
       			shopId: shopObjId[0]._id, 
       			region: shopObjId[0].region,
       			position: {lat: 37.488753, lng: 127.005386},
       			couponName: "돌판 오리고기", 
       			primeCost: 55000, 
       			price: 30000, 
       			quantity: 80, 
       			saleDate: {start: new Date(now*1-1000*60*60*24*11), finish: new Date(now*1+1000*60*60*24*2)}, 
       			useDate: {start: new Date(now*1+1000*60*60*24*8), finish: new Date(now*1+1000*60*60*24*15)}, 
       			image: {main: {file: "photo/coupon_14.jpg", desc: "돌판 오리고기"}, detail: {file: "photo/coupon_14_detail.jpg", desc: "돌판 오리고기 상세이미지"}, etc: []}, 
       			desc: "오리고기의 명문..돌판 오리고기. 돌판 오리고기에서는 국내산만을 취급합니다.", 
       			comment: "토요일 및 공휴일 사용 불가", 
       			buyQuantity: 20, 
       			regDate: new Date(now*1-1000*60*60*24*10),
       			epilogueCount: 4,
       			viewCount: 16,
       			satisfactionAvg: 1.34532
       		},
       		{
       			_id: couponObjId[14],
       			shopId: shopObjId[1]._id, 
       			region: shopObjId[1].region,
       			position: {lat: 37.4886163, lng: 127.031822},
       			couponName: "정로곱창", 
       			primeCost: 38000, 
       			price: 20000, 
       			quantity: 37, 
       			saleDate: {start: new Date(now*1-1000*60*60*24*10), finish: new Date(now*1+1000*60*60*24*10)}, 
       			useDate: {start: new Date(now*1+1000*60*60*24*8), finish: new Date(now*1+1000*60*60*24*10)}, 
       			image: {main: {file: "photo/coupon_15.jpg", desc: "정로 곱창"}, detail: {file: "photo/coupon_15_detail.jpg", desc: "정로곱창 상세이미지"}, etc: []}, 
       			desc: "쫄깃쫄깃 고소, 달콤, 매콤, 고소한 정로 곱창. 곱창의 품격을 느낄 수 있는 정로 곱창으로 오세요.", 
       			comment: "가족단위 방문시 음료수 1병 무료 서비스", 
       			buyQuantity: 23, 
       			regDate: new Date(now*1-1000*60*60*24*10),
       			epilogueCount: 5,
       			viewCount: 124,
       			satisfactionAvg: 4.56745
       		},
       		{
       			_id: couponObjId[15],
       			shopId: shopObjId[2]._id, 
       			region: shopObjId[2].region,
       			position: {lat: 37.524207, lng: 127.029446},
       			couponName: "디저트 마카롱", 
       			primeCost: 5500, 
       			price: 4700, 
       			quantity: 100, 
       			saleDate: {start: new Date(now*1-1000*60*60*24*30), finish: new Date(now*1+1000*60*60*24*5)}, 
       			useDate: {start: new Date(now*1-1000*60*60*24*20), finish: new Date(now*1+1000*60*60*24*60)}, 
       			image: {main: {file: "photo/coupon_16.jpg", desc: "디저트 마카롱 메인 이미지"}, detail: {file: "photo/coupon_16_detail.jpg", desc: "디저트 마카롱 상세 이미지"}, etc: [{file: "photo/coupon_16_1.jpg", desc: "디저트 마카롱 /스트로베리"}, {file: "photo/coupon_16_2.jpg", desc: "디저트 마카롱/그린티"}]}, 
       			desc: "바삭하고 쫀득한 초코 마카롱과 망고 마카롱사이에 새콤달콤한 패션망고크림과 상큼한 요거생크림, 신선한 과일을 담아낸 디저트", 
       			comment: "한 테이블에 하나만 사용 가능.", 
       			buyQuantity: 20, 
       			regDate: new Date(now*1-1000*60*60*24*30),
       			epilogueCount: 52,
       			viewCount: 270,
       			satisfactionAvg: 3.678454
       		}
       	];
       		
       	// 4. 쿠폰 데이터 등록 완료 시 구매 데이터 등록
       	clog.debug("3. 쿠폰 등록 완료.");
       	db.coupon.insert(coupons, registPurchase);
	});
}

// 구매 데이터 등록
function registPurchase(){
	var purchases = [
  		{
  			couponId: couponObjId[0], 
  			email: "uzoolove@gmail.com", 
  			quantity: 1, 
  			paymentInfo: {cardType: "KB", cardNumber: "123", cardExpireYear: "2015", cardExpireMonth: "05", csv: "567", price: "6000"},
  			isMember: true, 
  			regDate: new Date(now-60*60*24*1)
  		},
  		{
  			couponId: couponObjId[1], 
  			email: "uzoolove@gmail.com", 
  			quantity: 10, 
  			paymentInfo: {cardType: "KB", cardNumber: "123", cardExpireYear: "2015", cardExpireMonth: "05", csv: "567", price: "120000"},
  			isMember: true, 
  			regDate: new Date(now-60*60*24*7)
  		},
  		{
  			couponId: couponObjId[1], 
  			email: "test", 
  			quantity: 2, 
  			paymentInfo: {cardType: "KB", cardNumber: "123", cardExpireYear: "2015", cardExpireMonth: "05", csv: "567", price: "24000"},
  			isMember: true, 
  			regDate: new Date(now-60*60*24*3)	
  		},
  		{
  			couponId: couponObjId[2], 
  			email: "test", 
  			quantity: 1, 
  			paymentInfo: {cardType: "KB", cardNumber: "123", cardExpireYear: "2015", cardExpireMonth: "05", csv: "567", price: "10000"},
  			isMember: true, 
  			regDate: new Date(now-60*60*24*10)	
  		},
  		{
  			couponId: couponObjId[2], 
  			email: "aceppin@paran.com", 
  			quantity: 1, 
  			paymentInfo: {cardType: "KB", cardNumber: "123", cardExpireYear: "2015", cardExpireMonth: "05", csv: "567", price: "10000"},
  			isMember: false, 
  			password: "456",
  			regDate: new Date(now-60*60*24*10)	
  		},
  		{
  			couponId: couponObjId[2], 
  			email: "seulbinim@gmail.com", 
  			quantity: 1, 
  			paymentInfo: {cardType: "KB", cardNumber: "123", cardExpireYear: "2015", cardExpireMonth: "05", csv: "567", price: "10000"},
  			isMember: true, 
  			regDate: new Date(now-60*60*24*2)	
  		},
  		{
  			couponId: couponObjId[15], 
  			email: "seulbinim@gmail.com", 
  			quantity: 1, 
  			paymentInfo: {cardType: "KB", cardNumber: "123", cardExpireYear: "2015", cardExpireMonth: "05", csv: "567", price: "4700"},
  			isMember: true, 
  			regDate: new Date(now-60*60*24*4)	
  		},
  		{
  			couponId: couponObjId[15], 
  			email: "test", 
  			quantity: 2, 
  			paymentInfo: {cardType: "KB", cardNumber: "123", cardExpireYear: "2015", cardExpireMonth: "05", csv: "567", price: "9400"},
  			isMember: true, 
  			regDate: new Date(now-60*60*24*3)	
  		},
  		{
  			couponId: couponObjId[15], 
  			email: "uzoolove@gmail.com", 
  			quantity: 5, 
  			paymentInfo: {cardType: "KB", cardNumber: "123", cardExpireYear: "2015", cardExpireMonth: "05", csv: "567", price: "23500"},
  			isMember: true, 
  			regDate: new Date(now-60*60*24*1)	
  		}
  	];
	
	// 5. 구매 데이터 등록 완료 시 후기 데이터 등록
	clog.debug("4. 구매 등록 완료.");
  	db.purchase.insert(purchases, registEpilogue);
}

// 후기 데이터 등록
function registEpilogue(){
	var epilogues = [
		{
			couponId: couponObjId[0],
			writer: "uzoolove@gmail.com",
			satisfaction: 4,
			content: "치맥 괜찮아요.",			
			regDate: new Date(now-60*60*24*1)			
		},
		{
			couponId: couponObjId[0],
			writer: "uzoolove@gmail.com",
			satisfaction: 5,
			content: "치맥은 역시 을지로 골뱅이가 최고.",
			regDate: new Date(now-60*60*24*5)
		},
		{
			couponId: couponObjId[1],
			writer: "uzoolove@gmail.com",
			satisfaction: 5,
			content: "와플 짱!!! 강추해요.",
			regDate: new Date(now-60*60*24*8)			
		},
		{
			couponId: couponObjId[1],
			writer: "test",
			satisfaction: 3,
			content: "벌써 두번째 구매인데 와플이 맛있어요.",
			regDate: new Date(now-60*60*24*20)			
		},
		{
			couponId: couponObjId[15],
			writer: "seulbinim@gmail.com",
			satisfaction: 5,
			content: "이제훈 봤어요.",
			regDate: new Date(now-60*60*24*4)			
		},
		{
			couponId: couponObjId[15],
			writer: "test",
			satisfaction: 5,
			content: "망고보다는 스트로베리가 더 맛있어요.",
			regDate: new Date(now-60*60*24*3)
		},
		{
			couponId: couponObjId[15],
			writer: "uzoolove@gmail.com",
			satisfaction: 4,
			content: "최고입니다.",
			regDate: new Date(now-60*60*24*1)
		}		
	];
	
	// 6. 후기 데이터 등록 완료 시 등록한 쿠폰 목록을 확인한다.
	clog.debug("5. 후기 등록 완료.");
	db.epilogue.insert(epilogues, findCoupon);
}




// 모든 쿠폰명을 출력한다.
function findCoupon(){
	db.coupon.find({}, {_id: 0, couponName: 1}).toArray(function(err, result){
		clog.debug(result);
		clog.info("6. 쿠폰 " + result.length + "건 조회됨.");
	});
}









