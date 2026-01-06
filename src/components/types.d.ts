export type ColorScheme =  {
  label:string, 
  labelFont:string, 

  primary: Color, // any color
  accent: Color, // primary compliment, visible over primary
  fontPrimary: Color, // negation of primary
  fontAccent: Color // fontPrimary compliment
}