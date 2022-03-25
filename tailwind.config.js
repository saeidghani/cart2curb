module.exports = {
  future: {
    removeDeprecatedGapUtilities: true,
    purgeLayersByDefault: true,
  },
  purge: ['./components/**/*.{js,ts,jsx,tsx}', './pages/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: ' #FF4B45',
        secondarey: '#1890FF',
        type: '#242B36',
        overline: '#C1C4C8',
        background: '#FAFAFA',
        surface: '#FFFFFF',
        paragraphe: '#595959',
        stroke: '#F0F0F0',
        input: '#D9D9D9',
        gray: '#E8E8E8',
        light: '#606F87',
        btn: '#FF4B45',
        secondary: '#242B36',
        info: '#40BFC1',
        fade: '#AEB7C5',
        third: '#2B3340',
        card: '#F7F7F7',
        border: '#f5f5f5',
        icon: '#8c8c8c',
        label: '#262626',
        paragraph: '#696E79',
        header: '#C1C4C8',
        button: '#FF6560',
        cell: '#595959',
        muted: '#727A8B',
        dark: '#020911',
        faq: '#dddddd'
      },
      spacing: {
        1.5: '0.313rem',
        2.2: '0.563rem',
        2.4: '0.688rem',
        3.5: '0.813rem',
        3.6: '0.875rem',
        4.5: '1.125rem',
        5.5: '1.375rem',
        7: '1.625rem',
        7.5: '1.875rem',
        9: '2.25rem',
        11: '2.875rem',
        12.5: '3.125rem',
        13: '3.313rem',
        14: '3.5rem',
        14.5: '3.688rem',
        15: '3.75rem',
        15.5: '3.813rem',
        16.5: '4.125rem',
        17: '4.25rem',
        17.5: '4.375rem',
        19: '4.875rem',
        21: '5.188rem',
        23: '5.625rem',
        24.5: '6.75rem',
        25: '7.25rem',
        30: '7.5rem',
        31: '7.813rem',
        34: '8.125rem',
        37.5: '10.313rem',
        38.5: '10.813rem',
        44: '11.5rem',
        48.5: '13.875rem',
        67: '17.125rem',
        71: '17.625rem',
        81: '20.813rem',
        83: '21.813rem',
        90: '24rem',
        150: '42.125rem',
        170: '55.8rem'
      },
      borderRadius: {
        'semi-md': '0.313rem',
        '2xl': '0.875rem',
        '2px': '2px',
        '4px': '4px',
        '6px': '6px',
        '8px': '8px',
        '10px': '10px',
        '12px': '2px',
        '14px': '14px',
        '16px': '16px',
        '18px': '18px'
      },
      opacity: {
        20: '.2',
        30: '.3'
      },
      fontSize: {
        '10px': '0.625rem',
        '12px': '0.75rem',
        '14px': '0.875rem',
        '16px': '1rem',
        '18px': '1.125rem',
        '20px': '1.25rem',
        '22px': '1.375rem',
        '24px': '1.5rem',
        '4.5xl': '2.375rem'
      }
    }
  },
  variants: {},
  plugins: []
};