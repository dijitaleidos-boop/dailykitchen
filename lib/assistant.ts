import {packages} from './catalog';
export type Intent='measurement'|'medical'|'urgent'|'weight'|'sport'|'lunch'|'veggie'|'balanced'|'frequency'|'nutrition'|'unknown';
export type AssistantReply={title:string;text:string;reasons:string[];schedule:string[];packageIndex:number|null;mealIds:string[];clinic:boolean;urgent?:boolean;followups:string[]};
export const normalize=(s:string)=>s.toLocaleLowerCase('tr-TR').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/ı/g,'i');
export function detectIntent(message:string):Intent{const s=normalize(message);
const age=s.match(/(?:yasim\s*[:=]?\s*(\d{1,3})|(\d{1,3})\s*yas)/);if(age&&Number(age[1]||age[2])<18)return 'medical';
if(/gogus agr|nefes alam|bayil|bilinc kay|intihar/.test(s))return 'urgent';
if(/kas (olc|oran|kutle|kitle)|yag (olc|oran)|vucut analiz|inbody|biyoempedans|bioimped|cihaz|klinik/.test(s))return 'measurement';
if(/diyabet|seker hast|kalp|bobrek|hamil|gebe|emzir|alerj|colyak|insulin|ilac|tansiyon|kan tahlil|kanser|ameliyat|yeme bozuk|anoreksi|bulimi|cocuk/.test(s)&&!/^ozel saglik ihtiyacim yok/.test(s))return 'medical';
if(/detoks|detox|oruc|ac kal|hizli kilo|[0-9]+\s*(kilo|kg).*hafta/.test(s))return 'medical';
if(/siklik|sik sik|kac (saat|ogun|kez)|ne zaman|hangi saat|her gun/.test(s))return 'frequency';
if(/kalori|protein|\bkj\b|kcal|besin deger/.test(s))return 'nutrition';
if(/vejet|vegan|et yem|etsiz/.test(s))return 'veggie';
if(/spor|antrenman|kas yap|kas kazan/.test(s))return 'sport';
if(/ofis|is yer|yogun|ogle|lunch/.test(s))return 'lunch';
if(/kilo|zayif/.test(s))return 'weight';
if(/denge|akdeniz|saglikli|duzenli/.test(s))return 'balanced';return 'unknown'}
export function createReply(messages:string[], classified?:Intent):AssistantReply{
const last=messages.at(-1)||'';const local=detectIntent(last);const prior=messages.map(detectIntent);
const priority=prior.includes('urgent')?'urgent':prior.includes('measurement')?'measurement':prior.includes('medical')?'medical':local;
const intent=priority==='unknown'&&classified?classified:priority;
const base={packageIndex:null,mealIds:[],clinic:false,followups:[]} as Pick<AssistantReply,'packageIndex'|'mealIds'|'clinic'|'followups'>;
if(intent==='urgent')return {...base,title:'Önce acil destek',text:'Acil bir belirti tarif ediyorsan yemek seçimini beklet. Türkiye’de 112’yi ara veya en yakın acil servise başvur.',reasons:[],schedule:[],clinic:true,urgent:true};
if(intent==='measurement')return {...base,title:'Bu adım için klinikte görüşelim.',text:'Kas kütleni veya yağ oranını sohbetten, yaşından ve kilondan ölçemem. Vücut kompozisyonunun cihazla değerlendirilmesi için diyetisyen kliniğinde yüz yüze görüşme gerekir.',reasons:['Ölçüm yöntemi ve sonucu diyetisyen tarafından değerlendirilir.','Porsiyonlar ve öğün düzeni ölçüm, sağlık geçmişi ve günlük rutinle birlikte netleştirilir.'],schedule:['Şimdilik kas oranı, kişisel kalori hedefi veya kesin öğün sıklığı vermiyorum.'],clinic:true};
if(intent==='medical')return {...base,title:'Menüyü diyetisyeninle netleştirelim.',text:'Sağlık durumu, ilaç, alerji, gebelik veya özel bir beslenme yaklaşımı söz konusu olduğunda bu sohbet kişisel diyet reçetesi vermez. Sana uygun yemek ve öğün sıklığı için diyetisyen değerlendirmesi gerekir.',reasons:['Hastalık ve ilaçlar öğün içeriğini, porsiyonunu ve zamanlamasını değiştirebilir.','Alerjen ve çapraz temas bilgileri gerçek reçetelerle doğrulanmalıdır.'],schedule:['Paket adı tek başına sana uygun olduğunu göstermez. Değerlendirme tamamlanmadan oruç, detoks veya kısıtlı beslenme planı başlatma.'],clinic:true};
if(intent==='unknown')return {...base,title:'Önce günlük rutinini tanıyalım.',text:'En çok hangi öğünde desteğe ihtiyacın var? İşte öğle yemeği, antrenman günleri veya gün boyu dengeli bir düzen arasından başlayabiliriz. Mevcut menüleri içerikleriyle karşılaştıracağım.',reasons:[],schedule:[],followups:['İş yerinde öğle yemeği istiyorum','Spor yapıyorum','Et yemiyorum','Kas ölçümü yaptırmak istiyorum']};
let selected=1;if(intent==='sport')selected=5;if(intent==='balanced'||intent==='weight')selected=0;
const prev=[...messages.slice(0,-1)].reverse().map(detectIntent).find(x=>['sport','lunch','veggie','balanced','weight'].includes(x));
const goal=(intent==='frequency'||intent==='nutrition')?(prev||'lunch'):intent;
if(goal==='sport')selected=5;else if(goal==='balanced'||goal==='weight')selected=0;
const p=packages[selected];const vegetarian=goal==='veggie';
const reasons=goal==='sport'?['Sporbro – Powergirl paketinde spor öncesi ve sonrası için ayrı öğün alanları bulunuyor.','Menüdeki tavuk ve somon seçeneklerinin protein miktarlarını yan yana inceleyebilirsin; bu miktarlar kişisel protein ihtiyacın anlamına gelmez.']:goal==='lunch'?['Lunch & Snack, istediğin öğle öğününü ve bir ara öğünü kapsıyor.','Tüm günü kapsayan abonelik yerine yalnızca ihtiyaç duyduğun zaman dilimini seçebilirsin.']:vegetarian?['Nohutlu mevsim salatasının örnek reçetesinde et ve balık bulunmuyor.','Süt içeren ara öğünleri ayrıca kontrol et: vejetaryen ve vegan aynı tercih değildir.']:['Akdeniz Diyeti paketi kahvaltı, öğle, ara öğün ve akşam için ayrı öğünler içeriyor.','Farklı öğünleri tek pakette planlamaya imkân veriyor; kilo değişimi veya hastalık tedavisi sonucu vaat etmez.'];
return {...base,title:intent==='frequency'?'Öğün düzeni nasıl görünebilir?':intent==='nutrition'?'Besin değerlerine birlikte bakalım.':vegetarian?'Etsiz seçenekleri karşılaştıralım.':p.name+' paketini inceleyebilirsin.',text:'Bu, menü içeriği ve belirttiğin rutin üzerinden bir karşılaştırma. Sana tıbben uygun olduğuna karar vermek için sağlık ihtiyaçların, alerjilerin ve porsiyonların diyetisyen tarafından değerlendirilmelidir.',reasons,schedule:vegetarian?['Nohutlu salata bir ana öğün seçeneğidir. Kaç kez ve hangi porsiyonda tüketileceği kişisel plana göre belirlenir.']:[`Paketin teslim edilen gün başına ${p.slots.length} öğün alanı var: ${p.slots.join(' → ')}.`,goal==='sport'?'Spor öncesi ve sonrası öğünler antrenman zamanına göre planlanır; buradan sabit bir saat veya süre veremem.':'Bu sıralama paket içeriğini anlatır; herkes için zorunlu öğün sayısı veya “şu saatte yemelisin” önerisi değildir.','Aynı yemeği her gün tüketme zorunluluğu yok. Haftalık çeşitlilik, porsiyon ve kesin sıklık diyetisyenle netleşir.'],packageIndex:vegetarian?null:selected,mealIds:vegetarian?['chickpea','soup']:goal==='sport'?['chicken','salmon']:['chicken','chickpea'],followups:['Ne sıklıkla yemeliyim?','Besin değerlerini karşılaştır','Kas ölçümü yaptırmak istiyorum']};
}
