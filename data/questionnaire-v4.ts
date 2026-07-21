import { Question } from '@/types/questionnaire';

export const questionnaireV4: Question[] = [
  { id:'primary_goals', module:'Your goals', title:'What would you most like your home to help you improve?', helper:'Choose up to three. These goals determine your priorities.', type:'multi', required:true, maxSelections:3, options:[
    {label:'Better sleep',value:'sleep'},{label:'Cleaner-feeling air',value:'air'},{label:'Reduce allergy triggers',value:'allergies'},{label:'Lower stress and clutter',value:'stress'},{label:'Better focus and productivity',value:'focus'},{label:'Safer material choices',value:'materials'},{label:'Lower energy and water use',value:'sustainability'},{label:'Plan a healthier renovation',value:'renovation'},{label:'Reduce maintenance surprises',value:'maintenance'},{label:'Support children or aging family members',value:'family_support'}]},
  { id:'household_composition', module:'Your household', title:'Who lives in the home?', type:'multi', required:true, options:[
    {label:'One adult',value:'one_adult'},{label:'Two or more adults',value:'adults'},{label:'Children under 6',value:'young_children'},{label:'Children 6–17',value:'children'},{label:'Adults 65+',value:'older_adults'},{label:'Pets',value:'pets'}]},
  { id:'household_considerations', module:'Your household', title:'Are any of these considerations important in your household?', helper:'This is used only to tailor general home guidance, not to diagnose health conditions.', type:'multi', options:[
    {label:'Seasonal or indoor allergies',value:'allergies'},{label:'Asthma or breathing sensitivity',value:'breathing'},{label:'Fragrance or chemical sensitivity',value:'chemical'},{label:'Sensory sensitivity',value:'sensory'},{label:'Mobility or accessibility needs',value:'mobility'},{label:'None / prefer not to say',value:'none'}]},
  { id:'home_type', module:'Your home', title:'What type of home is it?', type:'single', pillar:'lifestyle', options:[
    {label:'Detached house',value:'house'},{label:'Townhome',value:'townhome'},{label:'Condo',value:'condo'},{label:'Apartment',value:'apartment'},{label:'Small multifamily building',value:'multifamily'}]},
  { id:'home_age', module:'Your home', title:'About when was it built?', type:'single', options:[
    {label:'Before 1940',value:'pre1940',risk:2},{label:'1940–1977',value:'1940_1977',risk:2},{label:'1978–1999',value:'1978_1999',risk:1},{label:'2000–2019',value:'2000_2019'},{label:'2020 or newer',value:'2020_plus'},{label:'Not sure',value:'unknown',risk:1}]},
  { id:'zip_code', module:'Your home', title:'ZIP code', type:'text', required:true },
  { id:'own_or_rent', module:'Your plans', title:'Do you own or rent?', type:'single', options:[{label:'Own',value:'own'},{label:'Rent',value:'rent'}]},
  { id:'home_plans', module:'Your plans', title:'What are your plans for this home?', type:'single', options:[
    {label:'Stay 5+ years',value:'long_term'},{label:'Stay 1–5 years',value:'medium_term'},{label:'Move within a year',value:'short_term'},{label:'Renovate soon',value:'renovate'},{label:'It is a rental property',value:'rental'}]},
  { id:'budget', module:'Your capacity', title:'What budget feels realistic for your first improvements?', type:'single', required:true, options:[
    {label:'Mostly free changes',value:'free'},{label:'Under $100',value:'under_100'},{label:'$100–$500',value:'100_500'},{label:'$500–$2,000',value:'500_2000'},{label:'Over $2,000',value:'over_2000'}]},
  { id:'diy_comfort', module:'Time and DIY comfort', title:'How comfortable are you with DIY?', type:'single', options:[
    {label:'Not comfortable',value:'none'},{label:'Simple swaps and organizing',value:'light'},{label:'Painting and basic installation',value:'medium'},{label:'Experienced DIY',value:'advanced'}]},
  { id:'weekly_time', module:'Time and DIY comfort', title:'How much time could you spend on home improvements most weeks?', type:'single', options:[
    {label:'None',value:'none'},{label:'15 minutes',value:'15m'},{label:'About one hour',value:'1h'},{label:'Half a day',value:'half_day'},{label:'A full weekend day',value:'full_day'}]},
  { id:'cook_frequency', module:'Kitchen', title:'How often do you cook at home?', type:'single', pillar:'lifestyle', options:[
    {label:'Rarely',value:'rarely'},{label:'A few times a week',value:'sometimes'},{label:'Most days',value:'daily'},{label:'Multiple times a day',value:'frequent'}]},
  { id:'cooktop_type', module:'Kitchen', title:'What type of cooktop do you use?', type:'single', pillar:'air', options:[
    {label:'Gas',value:'gas',risk:3},{label:'Electric coil or radiant',value:'electric'},{label:'Induction',value:'induction'},{label:'Not sure',value:'unknown',risk:1}]},
  { id:'kitchen_exhaust', module:'Kitchen', title:'Where does the kitchen exhaust send air?', type:'single', pillar:'air', options:[
    {label:'Outside',value:'outside'},{label:'Recirculates into the room',value:'recirculating',risk:2},{label:'No hood or fan',value:'none',risk:3},{label:'Not sure',value:'unknown',risk:1}]},
  { id:'moisture_signs', module:'Moisture and air', title:'Have you noticed moisture-related signs?', type:'multi', required:true, pillar:'air', options:[
    {label:'Condensation on windows',value:'condensation',risk:1},{label:'Musty odors',value:'musty',risk:3},{label:'Past or current leaks',value:'leaks',risk:3},{label:'Visible staining or suspected mold',value:'staining',risk:3},{label:'Basement dampness',value:'basement',risk:2},{label:'None',value:'none'}]},
  { id:'hvac_filter', module:'Moisture and air', title:'When was the HVAC filter last changed?', type:'single', pillar:'maintenance', options:[
    {label:'Within 3 months',value:'recent'},{label:'3–6 months ago',value:'mid',risk:1},{label:'More than 6 months ago',value:'old',risk:2},{label:'No central HVAC',value:'none'},{label:'Not sure',value:'unknown',risk:1}]},
  { id:'bedroom_restfulness', module:'Bedroom and sleep', title:'How restorative does your main bedroom feel?', type:'scale', required:true, pillar:'comfort' },
  { id:'bedroom_disruptors', module:'Bedroom and sleep', title:'What commonly affects the bedroom at night?', type:'multi', pillar:'light', options:[
    {label:'Street or outdoor light',value:'outdoor_light',risk:1},{label:'Device or indicator lights',value:'device_light',risk:1},{label:'Noise',value:'noise',risk:2},{label:'Temperature swings',value:'temperature',risk:2},{label:'Clutter or work materials',value:'clutter',risk:1},{label:'None',value:'none'}]},
  { id:'room_temperature', module:'Comfort', title:'Are some rooms regularly too hot, cold, or drafty?', type:'single', pillar:'comfort', options:[
    {label:'No',value:'no'},{label:'Occasionally',value:'sometimes',risk:1},{label:'Yes, one or two rooms',value:'some_rooms',risk:2},{label:'Yes, throughout the home',value:'whole_home',risk:3}]},
  { id:'daylight', module:'Comfort', title:'How would you describe daylight in the rooms you use most?', type:'single', pillar:'light', options:[
    {label:'Good and comfortable',value:'good'},{label:'Too little',value:'low',risk:2},{label:'Too much glare or heat',value:'glare',risk:1},{label:'Varies greatly by room',value:'varies',risk:1}]},
  { id:'scented_products', module:'Materials and fragrance', title:'Which scented products are regularly used indoors?', type:'multi', pillar:'materials', options:[
    {label:'Plug-ins or aerosol fresheners',value:'air_freshener',risk:2},{label:'Scented candles or incense',value:'candles',risk:1},{label:'Strongly scented cleaning products',value:'cleaners',risk:1},{label:'Fragrance-free or minimal scent',value:'minimal'},{label:'None',value:'none'}]},
  { id:'acoustics', module:'Sound', title:'How would you describe noise levels in your home?', type:'single', pillar:'comfort', options:[
    {label:'Quiet most of the time',value:'quiet'},{label:'Occasional noise from outside (traffic, neighbors)',value:'outside_occasional',risk:1},{label:'Occasional noise from inside (appliances, HVAC, plumbing)',value:'inside_occasional',risk:1},{label:'Frequently noisy, hard to find quiet',value:'frequent',risk:2},{label:'Not sure',value:'unknown',risk:1}]},
  { id:'recent_changes', module:'Recent changes', title:'Have any of these happened in the last 12 months?', type:'multi', pillar:'materials', options:[
    {label:'Interior painting',value:'paint',risk:1},{label:'New flooring',value:'flooring',risk:2},{label:'New cabinets or built-ins',value:'cabinets',risk:2},{label:'New upholstered furniture or mattress',value:'furniture',risk:1},{label:'Major renovation',value:'renovation',risk:2},{label:'None',value:'none'}]},
  { id:'clutter_frequency', module:'Clutter', title:'How often does clutter interfere with daily routines?', type:'single', pillar:'comfort', options:[
    {label:'Rarely',value:'rarely'},{label:'Sometimes',value:'sometimes',risk:1},{label:'Often',value:'often',risk:2},{label:'Every day',value:'daily',risk:3}]},
  { id:'priority_area', module:'Your starting point', title:'Which area would you most like to improve first?', type:'single', required:true, options:[
    {label:'Bedroom',value:'bedroom'},{label:'Kitchen',value:'kitchen'},{label:'Bathroom',value:'bathroom'},{label:'Living or family room',value:'living'},{label:'Home office',value:'office'},{label:'Basement',value:'basement'},{label:'Whole-home systems',value:'systems'},{label:'I want WellBuilt to choose',value:'choose'}]},
  { id:'open_notes', module:'Anything else', title:'Anything else you want WellBuilt to understand?', helper:'Optional. Do not include sensitive medical details.', type:'text' }
];
