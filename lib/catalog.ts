export type Meal = {id:string;name:string;contents:string;kcal:number;protein:number;carbs:number;fat:number;fiber:number;salt:number;allergens:string;price:number;vegetarian:boolean};
export const meals:Meal[]=[
{id:'salmon',name:'Somon & kinoa tabağı',contents:'Somon, kinoa, avokado, mevsim yeşillikleri',kcal:520,protein:34,carbs:42,fat:24,fiber:8,salt:1.1,allergens:'Balık',price:390,vegetarian:false},
{id:'chicken',name:'Izgara tavuk & bulgur',contents:'Tavuk göğsü, bulgur, fırın sebzeler',kcal:460,protein:38,carbs:46,fat:13,fiber:7,salt:1.2,allergens:'Gluten',price:320,vegetarian:false},
{id:'chickpea',name:'Nohutlu mevsim salatası',contents:'Nohut, domates, salatalık, zeytinyağı',kcal:380,protein:16,carbs:43,fat:15,fiber:11,salt:.8,allergens:'Beyan edilen alerjen yok; çapraz temas doğrulanmadı',price:270,vegetarian:true},
{id:'breakfast',name:'Yulaf & yoğurt kasesi',contents:'Yulaf, yoğurt, mevsim meyvesi, ceviz',kcal:360,protein:17,carbs:42,fat:14,fiber:6,salt:.2,allergens:'Süt, ceviz, gluten',price:220,vegetarian:true},
{id:'snack',name:'Meyve & kefir',contents:'Mevsim meyvesi ve sade kefir',kcal:190,protein:8,carbs:27,fat:5,fiber:3,salt:.2,allergens:'Süt',price:130,vegetarian:true},
{id:'soup',name:'Mercimek çorbası',contents:'Mercimek, havuç, soğan, zeytinyağı',kcal:220,protein:11,carbs:30,fat:6,fiber:8,salt:.9,allergens:'Çapraz temas doğrulanmadı',price:150,vegetarian:true},
{id:'juice',name:'Sebze & meyve suyu',contents:'Elma, havuç ve limon',kcal:110,protein:1,carbs:26,fat:0,fiber:1,salt:.1,allergens:'Çapraz temas doğrulanmadı',price:120,vegetarian:true},
];
export const mealById=(id:string)=>meals.find(m=>m.id===id)!;
export const toKj=(kcal:number)=>Math.round(kcal*4.184);
export const formatNum=(n:number)=>n.toLocaleString('tr-TR');
export const packages=[
{id:'med',name:'Akdeniz Diyeti',price:650,slots:['Kahvaltı','Öğle','Ara öğün','Akşam'],mealIds:['breakfast','salmon','snack','chickpea'],review:false},
{id:'lunch',name:'Lunch & Snack',price:350,slots:['Ana öğün','Ara öğün'],mealIds:['chicken','snack'],review:false},
{id:'circadian',name:'Sirkadiyen Oruç',price:520,slots:['Kahvaltı','Ara öğün','Erken akşam'],mealIds:['breakfast','snack','chicken'],review:true},
{id:'fasting',name:'Aralıklı Oruç',price:520,slots:['Öğle','Ara öğün','Akşam'],mealIds:['salmon','snack','chickpea'],review:true},
{id:'motherhood',name:'Motherhood',price:850,slots:['Kahvaltı','Ara öğün','Öğle','Ara öğün','Akşam','Gece'],mealIds:['breakfast','snack','salmon','snack','chickpea','snack'],review:true},
{id:'sport',name:'Sporbro – Powergirl',price:780,slots:['Kahvaltı','Öğle','Spor öncesi','Spor sonrası','Akşam'],mealIds:['breakfast','chicken','snack','snack','salmon'],review:false},
{id:'sport-lunch',name:'Sporbro – Powergirl Lunch & Snack',price:410,slots:['Öğle','Spor sonrası'],mealIds:['chicken','snack'],review:false},
{id:'detox',name:'Detoks',price:600,slots:['Juice 1','Çorba 1','Salata','Juice 2','Çorba 2'],mealIds:['juice','soup','chickpea','juice','soup'],review:true},
];
export function packageNutrition(index:number){const list=packages[index].mealIds.map(mealById);return list.reduce((a,m)=>({kcal:a.kcal+m.kcal,protein:a.protein+m.protein,carbs:a.carbs+m.carbs,fat:a.fat+m.fat}),{kcal:0,protein:0,carbs:0,fat:0})}
