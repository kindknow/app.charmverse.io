import { SvgIcon } from '@mui/material';

export function ClaimIcon({ animate = false }: { animate?: boolean }) {
  return (
    <SvgIcon
      sx={{
        width: 25,
        height: 25,
        '@keyframes wiggle': {
          '0%': {
            transform: 'rotate(0deg)',
            scale: 1
          },
          '5%': {
            transform: 'rotate(-15deg)',
            scale: 1.25
          },
          '10%': {
            transform: 'rotate(0deg)',
            scale: 1
          },
          '15%': {
            transform: 'rotate(15deg)',
            scale: 1.25
          },
          '20%': {
            transform: 'rotate(0deg)',
            scale: 1
          }
        },
        animation: animate ? 'wiggle 10s ease-in-out infinite' : 'none'
      }}
    >
      <svg width='25px' height='25px' viewBox='0 0 25 25' version='1.1'>
        <defs>
          <clipPath id='clip1'>
            <path d='M 1.203125 10.867188 L 12.933594 10.867188 L 12.933594 19 L 1.203125 19 Z M 1.203125 10.867188 ' />
          </clipPath>
        </defs>
        <g id='surface1'>
          <path
            style={{
              stroke: 'none',
              fillRule: 'nonzero',
              fill: 'currentColor',
              fillOpacity: 1
            }}
            d='M 12.496094 14.9375 C 12.445312 14.9375 12.394531 14.925781 12.347656 14.90625 L 4.296875 11.6875 C 4.136719 11.621094 4.039062 11.472656 4.042969 11.304688 C 4.042969 11.136719 4.15625 10.992188 4.3125 10.933594 L 7.527344 9.808594 C 7.738281 9.734375 7.96875 9.84375 8.039062 10.050781 C 8.113281 10.261719 8.003906 10.492188 7.792969 10.5625 L 5.589844 11.335938 L 12.496094 14.097656 L 19.398438 11.335938 L 16.878906 10.453125 C 16.671875 10.382812 16.558594 10.152344 16.632812 9.945312 C 16.707031 9.734375 16.9375 9.621094 17.144531 9.699219 L 20.679688 10.933594 C 20.835938 10.992188 20.945312 11.136719 20.949219 11.304688 C 20.949219 11.472656 20.851562 11.621094 20.695312 11.6875 L 12.644531 14.90625 C 12.597656 14.925781 12.542969 14.9375 12.496094 14.9375 Z M 12.496094 14.9375 '
          />
          <g clipPath='url(#clip1)' clipRule='nonzero'>
            <path
              style={{
                stroke: 'none',
                fillRule: 'nonzero',
                fill: 'currentColor',
                fillOpacity: 1
              }}
              d='M 10.082031 18.960938 C 10.023438 18.960938 9.964844 18.949219 9.90625 18.921875 L 1.453125 14.894531 C 1.339844 14.84375 1.257812 14.738281 1.230469 14.613281 C 1.207031 14.488281 1.238281 14.363281 1.324219 14.265625 L 4.140625 11.046875 C 4.253906 10.917969 4.4375 10.875 4.59375 10.9375 L 12.644531 14.160156 C 12.753906 14.203125 12.839844 14.292969 12.878906 14.402344 C 12.914062 14.515625 12.902344 14.636719 12.84375 14.738281 L 10.425781 18.765625 C 10.351562 18.890625 10.21875 18.960938 10.082031 18.960938 Z M 2.277344 14.398438 L 9.921875 18.039062 L 11.910156 14.734375 L 4.5625 11.796875 L 2.28125 14.398438 Z M 2.277344 14.398438 '
            />
          </g>
          <path
            style={{
              stroke: 'none',
              fillRule: 'nonzero',
              fill: 'currentColor',
              fillOpacity: 1
            }}
            d='M 15.3125 18.960938 C 15.183594 18.960938 15.058594 18.902344 14.984375 18.789062 L 12.164062 14.761719 C 12.097656 14.660156 12.074219 14.53125 12.109375 14.417969 C 12.144531 14.300781 12.230469 14.203125 12.347656 14.160156 L 20.398438 10.9375 C 20.554688 10.875 20.738281 10.917969 20.847656 11.046875 L 23.667969 14.265625 C 23.746094 14.359375 23.785156 14.488281 23.761719 14.609375 C 23.734375 14.730469 23.65625 14.835938 23.546875 14.890625 L 15.496094 18.917969 C 15.4375 18.945312 15.375 18.960938 15.3125 18.960938 Z M 13.117188 14.71875 L 15.441406 18.042969 L 22.71875 14.402344 L 20.429688 11.792969 Z M 13.117188 14.71875 '
          />
          <path
            style={{
              stroke: 'none',
              fillRule: 'nonzero',
              fill: 'currentColor',
              fillOpacity: 1
            }}
            d='M 12.496094 25 C 12.4375 25 12.371094 24.984375 12.316406 24.957031 L 4.261719 20.929688 C 4.125 20.863281 4.042969 20.71875 4.042969 20.570312 L 4.042969 17.441406 C 4.042969 17.21875 4.222656 17.035156 4.445312 17.035156 C 4.664062 17.035156 4.847656 17.21875 4.847656 17.441406 L 4.847656 20.320312 L 12.09375 23.945312 L 12.09375 14.53125 C 12.09375 14.3125 12.273438 14.128906 12.496094 14.128906 C 12.71875 14.128906 12.898438 14.3125 12.898438 14.53125 L 12.898438 24.597656 C 12.898438 24.738281 12.824219 24.867188 12.710938 24.941406 C 12.644531 24.980469 12.574219 25 12.496094 25 Z M 12.496094 25 '
          />
          <path
            style={{
              stroke: 'none',
              fillRule: 'nonzero',
              fill: 'currentColor',
              fillOpacity: 1
            }}
            d='M 12.496094 25 C 12.414062 25 12.339844 24.976562 12.269531 24.929688 C 12.160156 24.855469 12.09375 24.730469 12.09375 24.597656 L 12.09375 14.53125 C 12.09375 14.3125 12.273438 14.128906 12.496094 14.128906 C 12.71875 14.128906 12.898438 14.3125 12.898438 14.53125 L 12.898438 24 L 20.144531 21.101562 L 20.144531 17.773438 C 20.144531 17.550781 20.324219 17.371094 20.546875 17.371094 C 20.769531 17.371094 20.949219 17.550781 20.949219 17.773438 L 20.949219 21.375 C 20.949219 21.542969 20.847656 21.691406 20.695312 21.75 L 12.644531 24.972656 C 12.597656 24.992188 12.542969 25 12.496094 25 Z M 12.496094 25 '
          />
          <path
            style={{
              stroke: 'none',
              fillRule: 'nonzero',
              fill: 'currentColor',
              fillOpacity: 1
            }}
            d='M 11.683594 13.160156 C 11.617188 13.160156 11.550781 13.152344 11.484375 13.136719 C 11.183594 13.058594 10.953125 12.824219 10.886719 12.519531 L 10.53125 10.902344 L 8.988281 10.269531 C 8.699219 10.152344 8.507812 9.882812 8.484375 9.574219 C 8.460938 9.261719 8.621094 8.96875 8.890625 8.8125 L 10.316406 7.976562 L 10.441406 6.316406 C 10.46875 6.007812 10.660156 5.742188 10.945312 5.621094 C 11.234375 5.503906 11.5625 5.558594 11.792969 5.765625 L 13.03125 6.863281 L 14.648438 6.46875 C 14.957031 6.398438 15.265625 6.496094 15.46875 6.734375 C 15.667969 6.972656 15.714844 7.296875 15.589844 7.585938 L 14.925781 9.101562 L 15.800781 10.519531 C 15.964844 10.785156 15.964844 11.113281 15.800781 11.378906 C 15.636719 11.648438 15.34375 11.792969 15.027344 11.757812 L 13.378906 11.597656 L 12.304688 12.867188 C 12.144531 13.050781 11.921875 13.15625 11.683594 13.15625 Z M 11.253906 6.363281 L 11.125 8.027344 C 11.101562 8.292969 10.953125 8.535156 10.726562 8.671875 L 9.296875 9.507812 L 10.832031 10.148438 C 11.082031 10.25 11.265625 10.46875 11.320312 10.730469 L 11.675781 12.347656 L 12.757812 11.082031 C 12.929688 10.878906 13.191406 10.769531 13.457031 10.796875 L 15.109375 10.957031 L 14.242188 9.535156 C 14.101562 9.308594 14.082031 9.027344 14.1875 8.78125 L 14.851562 7.261719 L 13.234375 7.648438 C 12.972656 7.714844 12.695312 7.648438 12.496094 7.46875 L 11.257812 6.367188 C 11.257812 6.367188 11.257812 6.367188 11.253906 6.367188 Z M 11.253906 6.363281 '
          />
          <path
            style={{
              stroke: 'none',
              fillRule: 'nonzero',
              fill: 'currentColor',
              fillOpacity: 1
            }}
            d='M 19.402344 8.417969 C 19.210938 8.417969 19.023438 8.335938 18.878906 8.191406 L 18.023438 7.285156 L 16.792969 7.480469 C 16.519531 7.519531 16.246094 7.40625 16.085938 7.183594 C 15.925781 6.957031 15.910156 6.664062 16.042969 6.421875 L 16.636719 5.324219 L 16.074219 4.214844 C 15.949219 3.96875 15.972656 3.675781 16.144531 3.453125 C 16.3125 3.234375 16.582031 3.128906 16.855469 3.175781 L 18.078125 3.40625 L 18.964844 2.523438 C 19.164062 2.328125 19.449219 2.261719 19.710938 2.351562 C 19.972656 2.441406 20.15625 2.667969 20.191406 2.941406 L 20.355469 4.179688 L 21.464844 4.746094 C 21.710938 4.871094 21.863281 5.125 21.859375 5.398438 C 21.855469 5.675781 21.699219 5.921875 21.449219 6.042969 L 20.320312 6.578125 L 20.125 7.808594 C 20.082031 8.082031 19.886719 8.304688 19.625 8.386719 C 19.554688 8.40625 19.480469 8.417969 19.414062 8.417969 Z M 18.054688 6.472656 C 18.253906 6.472656 18.441406 6.554688 18.582031 6.699219 L 19.355469 7.515625 L 19.53125 6.410156 C 19.570312 6.175781 19.722656 5.972656 19.9375 5.871094 L 20.949219 5.386719 L 19.953125 4.875 C 19.738281 4.765625 19.59375 4.5625 19.566406 4.324219 L 19.421875 3.207031 L 18.625 4 C 18.453125 4.171875 18.210938 4.242188 17.980469 4.199219 L 16.875 3.992188 L 17.382812 4.996094 C 17.492188 5.210938 17.488281 5.457031 17.375 5.667969 L 16.835938 6.65625 L 17.945312 6.480469 C 17.984375 6.476562 18.019531 6.472656 18.058594 6.472656 Z M 21.097656 5.464844 Z M 19.394531 3.046875 Z M 19.394531 3.046875 Z M 19.394531 3.046875 '
          />
          <path
            style={{
              stroke: 'none',
              fillRule: 'nonzero',
              fill: 'currentColor',
              fillOpacity: 1
            }}
            d='M 4.875 8.683594 C 4.769531 8.683594 4.664062 8.660156 4.570312 8.605469 C 4.34375 8.492188 4.207031 8.261719 4.214844 8.007812 L 4.234375 7.042969 L 3.453125 6.476562 C 3.25 6.328125 3.148438 6.082031 3.1875 5.832031 C 3.230469 5.582031 3.40625 5.382812 3.652344 5.308594 L 4.574219 5.03125 L 4.867188 4.113281 C 4.945312 3.871094 5.148438 3.699219 5.398438 3.664062 C 5.648438 3.628906 5.894531 3.730469 6.039062 3.941406 L 6.589844 4.734375 L 7.554688 4.734375 C 7.8125 4.710938 8.039062 4.871094 8.152344 5.097656 C 8.265625 5.320312 8.242188 5.589844 8.085938 5.792969 L 7.503906 6.5625 L 7.804688 7.480469 C 7.886719 7.722656 7.820312 7.980469 7.640625 8.160156 C 7.460938 8.335938 7.199219 8.394531 6.960938 8.3125 L 6.050781 7.996094 L 5.273438 8.566406 C 5.15625 8.652344 5.019531 8.695312 4.882812 8.695312 Z M 4.160156 6 L 4.765625 6.4375 C 4.945312 6.566406 5.042969 6.769531 5.039062 6.988281 L 5.023438 7.738281 L 5.628906 7.292969 C 5.804688 7.164062 6.03125 7.128906 6.234375 7.203125 L 6.945312 7.449219 L 6.710938 6.734375 C 6.640625 6.53125 6.683594 6.300781 6.8125 6.128906 L 7.261719 5.53125 L 6.515625 5.53125 C 6.3125 5.53125 6.089844 5.425781 5.964844 5.25 L 5.539062 4.632812 L 5.308594 5.347656 C 5.242188 5.550781 5.082031 5.714844 4.871094 5.777344 L 4.15625 5.996094 Z M 4.640625 5.011719 Z M 4.640625 5.011719 '
          />
          <path
            style={{
              stroke: 'none',
              fillRule: 'nonzero',
              fill: 'currentColor',
              fillOpacity: 1
            }}
            d='M 13.8125 4.160156 C 13.691406 4.160156 13.574219 4.121094 13.46875 4.054688 L 12.878906 3.652344 L 12.210938 3.910156 C 11.992188 3.992188 11.75 3.945312 11.582031 3.789062 C 11.414062 3.632812 11.34375 3.394531 11.410156 3.171875 L 11.609375 2.484375 L 11.160156 1.929688 C 11.015625 1.746094 10.980469 1.503906 11.078125 1.292969 C 11.175781 1.078125 11.378906 0.945312 11.613281 0.9375 L 12.328125 0.917969 L 12.71875 0.316406 C 12.84375 0.121094 13.066406 0.015625 13.296875 0.0429688 C 13.527344 0.0742188 13.71875 0.226562 13.796875 0.441406 C 13.796875 0.441406 14.039062 1.113281 14.039062 1.113281 L 14.730469 1.300781 C 14.957031 1.359375 15.125 1.539062 15.167969 1.765625 C 15.214844 1.996094 15.128906 2.226562 14.945312 2.367188 L 14.375 2.804688 L 14.417969 3.519531 C 14.429688 3.753906 14.3125 3.964844 14.109375 4.078125 C 14.019531 4.128906 13.914062 4.160156 13.8125 4.160156 Z M 12.980469 3.609375 Z M 12.90625 2.816406 C 13.027344 2.816406 13.144531 2.855469 13.25 2.921875 L 13.59375 3.15625 L 13.570312 2.742188 C 13.558594 2.539062 13.648438 2.351562 13.804688 2.230469 L 14.132812 1.976562 L 13.730469 1.867188 C 13.539062 1.816406 13.386719 1.675781 13.316406 1.484375 L 13.175781 1.089844 L 12.949219 1.441406 C 12.84375 1.609375 12.660156 1.710938 12.460938 1.71875 L 12.042969 1.730469 L 12.304688 2.054688 C 12.425781 2.210938 12.472656 2.414062 12.414062 2.605469 L 12.296875 3.003906 L 12.6875 2.855469 C 12.757812 2.824219 12.835938 2.8125 12.90625 2.8125 Z M 14.074219 1.214844 Z M 12.273438 1.007812 Z M 12.273438 1.007812 '
          />
        </g>
      </svg>
    </SvgIcon>
  );
}