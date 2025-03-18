// todo: This could be populated dynamically by state using ElectionType model.
// Which would further reduce choices by state but we'd also need to
// append certain federal and state choices to the list.
export const ELECTION_TYPE_CHOICES = [
  { id: '', title: 'Entire State' },
  { id: 'US_Congressional_District', title: 'US Congressional District' },
  { id: 'State_Senate_District', title: 'State Senate District' },
  { id: 'State_House_District', title: 'State House District' },
  { id: 'County', title: 'County' },
  { id: 'Precinct', title: 'Precinct' },
  { id: 'City', title: 'City' },
  {
    id: 'City_Council_Commissioner_District',
    title: 'City Council Commissioner District',
  },
  { id: 'County_Commissioner_District', title: 'County Commissioner District' },
  {
    id: 'County_Supervisorial_District',
    title: 'County Supervisorial District',
  },
  { id: 'City_Mayoral_District', title: 'City Mayoral District' },
  { id: 'Town_District', title: 'Town District' },
  { id: 'Town_Council', title: 'Town Council' },
  { id: 'Village', title: 'Village' },
  { id: 'Township', title: 'Township' },
  { id: 'Borough', title: 'Borough' },
  { id: 'Hamlet_Community_Area', title: 'Hamlet Community Area' },
  { id: 'City_Ward', title: 'City Ward' },
  { id: 'Town_Ward', title: 'Town Ward' },
  { id: 'Township_Ward', title: 'Township Ward' },
  { id: 'Village_Ward', title: 'Village Ward' },
  { id: 'Borough_Ward', title: 'Borough Ward' },
  { id: 'Board_of_Education_District', title: 'Board of Education District' },
  {
    id: 'Board_of_Education_SubDistrict',
    title: 'Board of Education SubDistrict',
  },
  { id: 'City_School_District', title: 'City School District' },
  { id: 'College_Board_District', title: 'College Board District' },
  {
    id: 'Community_College_Commissioner_District',
    title: 'Community College Commissioner District',
  },
  {
    id: 'Community_College_SubDistrict',
    title: 'Community College SubDistrict',
  },
  {
    id: 'County_Board_of_Education_District',
    title: 'County Board of Education District',
  },
  {
    id: 'County_Board_of_Education_SubDistrict',
    title: 'County Board of Education SubDistrict',
  },
  {
    id: 'County_Community_College_District',
    title: 'County Community College District',
  },
  {
    id: 'County_Superintendent_of_Schools_District',
    title: 'County Superintendent of Schools District',
  },
  {
    id: 'County_Unified_School_District',
    title: 'County Unified School District',
  },
  { id: 'District_Attorney', title: 'District Attorney' },
  {
    id: 'Education_Commission_District',
    title: 'Education Commission District',
  },
  { id: 'Educational_Service_District', title: 'Educational Service District' },
  {
    id: 'Election_Commissioner_District',
    title: 'Election Commissioner District',
  },
  { id: 'Elementary_School_District', title: 'Elementary School District' },
  {
    id: 'Elementary_School_SubDistrict',
    title: 'Elementary School SubDistrict',
  },
  {
    id: 'Exempted_Village_School_District',
    title: 'Exempted Village School District',
  },
  { id: 'High_School_District', title: 'High School District' },
  { id: 'High_School_SubDistrict', title: 'High School SubDistrict' },
  { id: 'Judicial_Appellate_District', title: 'Judicial Appellate District' },
  {
    id: 'Judicial_Circuit_Court_District',
    title: 'Judicial Circuit Court District',
  },
  {
    id: 'Judicial_County_Board_of_Review_District',
    title: 'Judicial County Board of Review District',
  },
  {
    id: 'Judicial_County_Court_District',
    title: 'Judicial County Court District',
  },
  { id: 'Judicial_District', title: 'Judicial District' },
  {
    id: 'Judicial_District_Court_District',
    title: 'Judicial District Court District',
  },
  {
    id: 'Judicial_Family_Court_District',
    title: 'Judicial Family Court District',
  },
  { id: 'Judicial_Jury_District', title: 'Judicial Jury District' },
  {
    id: 'Judicial_Juvenile_Court_District',
    title: 'Judicial Juvenile Court District',
  },
  { id: 'Judicial_Magistrate_Division', title: 'Judicial Magistrate Division' },
  {
    id: 'Judicial_Sub_Circuit_District',
    title: 'Judicial Sub Circuit District',
  },
  {
    id: 'Judicial_Superior_Court_District',
    title: 'Judicial Superior Court District',
  },
  {
    id: 'Judicial_Supreme_Court_District',
    title: 'Judicial Supreme Court District',
  },
  { id: 'Middle_School_District', title: 'Middle School District' },
  { id: 'Municipal_Court_District', title: 'Municipal Court District' },
  {
    id: 'Proposed_City_Commissioner_District',
    title: 'Proposed City Commissioner District',
  },
  {
    id: 'Proposed_Elementary_School_District',
    title: 'Proposed Elementary School District',
  },
  {
    id: 'Proposed_Unified_School_District',
    title: 'Proposed Unified School District',
  },
  {
    id: 'Regional_Office_of_Education_District',
    title: 'Regional Office of Education District',
  },
  { id: 'School_Board_District', title: 'School Board District' },
  { id: 'School_District', title: 'School District' },
  { id: 'School_District_Vocational', title: 'School District Vocational' },
  {
    id: 'School_Facilities_Improvement_District',
    title: 'School Facilities Improvement District',
  },
  { id: 'School_Subdistrict', title: 'School Subdistrict' },
  { id: 'Service_Area_District', title: 'Service Area District' },
  {
    id: 'Superintendent_of_Schools_District',
    title: 'Superintendent of Schools District',
  },
  { id: 'Unified_School_District', title: 'Unified School District' },
  { id: 'Unified_School_SubDistrict', title: 'Unified School SubDistrict' },
];
