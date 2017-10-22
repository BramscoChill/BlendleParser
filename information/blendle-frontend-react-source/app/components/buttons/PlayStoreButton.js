/* eslint-disable max-len */
import React from 'react';

const AppStoreButton = (props) => (
  <a href="https://play.google.com/store/apps/details?id=com.blendle.app" target="_blank" {...props}>
    <svg xmlns="http://www.w3.org/2000/svg" width="144" height="44" viewBox="0 0 135 40">
      <path fill="none" d="M0 0h135v40H0z" />
      <path d="M130 40H5c-2.75 0-5-2.25-5-5V5c0-2.75 2.25-5 5-5h125c2.75 0 5 2.25 5 5v30c0 2.75-2.25 5-5 5z" />
      <path fill="#A6A6A6" d="M130 .8c2.316 0 4.2 1.884 4.2 4.2v30c0 2.316-1.884 4.2-4.2 4.2H5A4.205 4.205 0 0 1 .8 35V5C.8 2.684 2.684.8 5 .8h125m0-.8H5C2.25 0 0 2.25 0 5v30c0 2.75 2.25 5 5 5h125c2.75 0 5-2.25 5-5V5c0-2.75-2.25-5-5-5z" />
      <g fill="#FFF" stroke="#FFF" strokeWidth=".2" strokeMiterlimit="10">
        <path d="M47.418 10.243c0 .838-.248 1.505-.745 2.003-.564.592-1.3.888-2.204.888-.866 0-1.603-.3-2.208-.9-.606-.601-.909-1.345-.909-2.233 0-.889.303-1.633.909-2.233.605-.601 1.342-.901 2.208-.901.43 0 .841.084 1.231.251.391.168.704.391.938.67l-.527.528c-.397-.475-.944-.712-1.643-.712-.632 0-1.178.222-1.639.666s-.69 1.021-.69 1.73.23 1.286.691 1.73 1.007.666 1.639.666c.67 0 1.229-.223 1.676-.67.29-.291.458-.696.503-1.215h-2.179v-.72h2.907c.029.156.042.307.042.452zM52.028 7.737h-2.732V9.64h2.464v.721h-2.464v1.902h2.732V13h-3.503V7h3.503v.737zM55.279 13h-.771V7.737h-1.676V7h4.123v.737h-1.676V13zM59.938 13V7h.771v6h-.771zM64.128 13h-.771V7.737h-1.676V7h4.123v.737h-1.676V13zM73.609 12.225c-.59.606-1.323.909-2.2.909s-1.61-.303-2.199-.909c-.59-.606-.884-1.348-.884-2.225s.294-1.619.884-2.225c.589-.606 1.322-.91 2.199-.91.872 0 1.604.305 2.196.914.592.609.888 1.349.888 2.221 0 .877-.295 1.619-.884 2.225zm-3.83-.503c.444.45.987.674 1.63.674s1.187-.225 1.63-.674c.444-.45.667-1.024.667-1.722s-.223-1.272-.667-1.722c-.443-.45-.987-.674-1.63-.674s-1.186.225-1.63.674c-.443.45-.666 1.024-.666 1.722s.223 1.272.666 1.722zM75.575 13V7h.938l2.916 4.667h.033l-.033-1.156V7h.771v6h-.805l-3.051-4.894h-.033l.033 1.156V13h-.769z" />
      </g>
      <path fill="#FFF" d="M68.136 21.751c-2.352 0-4.269 1.789-4.269 4.253 0 2.449 1.917 4.253 4.269 4.253 2.353 0 4.27-1.804 4.27-4.253-.001-2.464-1.918-4.253-4.27-4.253zm0 6.832c-1.289 0-2.4-1.063-2.4-2.578 0-1.531 1.112-2.578 2.4-2.578 1.289 0 2.4 1.047 2.4 2.578 0 1.514-1.111 2.578-2.4 2.578zm-9.314-6.832c-2.352 0-4.269 1.789-4.269 4.253 0 2.449 1.917 4.253 4.269 4.253 2.353 0 4.27-1.804 4.27-4.253 0-2.464-1.917-4.253-4.27-4.253zm0 6.832c-1.289 0-2.4-1.063-2.4-2.578 0-1.531 1.112-2.578 2.4-2.578 1.289 0 2.4 1.047 2.4 2.578.001 1.514-1.111 2.578-2.4 2.578zm-11.078-5.526v1.804h4.318c-.129 1.015-.467 1.756-.983 2.271-.628.628-1.611 1.321-3.335 1.321-2.658 0-4.736-2.143-4.736-4.801s2.078-4.801 4.736-4.801c1.434 0 2.481.564 3.254 1.289l1.273-1.273c-1.08-1.031-2.513-1.82-4.527-1.82-3.641 0-6.702 2.964-6.702 6.605 0 3.641 3.061 6.605 6.702 6.605 1.965 0 3.448-.645 4.607-1.853 1.192-1.192 1.563-2.868 1.563-4.221 0-.418-.032-.805-.097-1.127h-6.073zm45.308 1.401c-.354-.95-1.434-2.707-3.641-2.707-2.191 0-4.012 1.724-4.012 4.253 0 2.384 1.805 4.253 4.221 4.253 1.949 0 3.077-1.192 3.545-1.885l-1.45-.967c-.483.709-1.144 1.176-2.095 1.176-.95 0-1.627-.435-2.062-1.289l5.687-2.352-.193-.482zm-5.8 1.418c-.048-1.644 1.273-2.481 2.224-2.481.741 0 1.369.371 1.579.902l-3.803 1.579zM82.629 30h1.868V17.499h-1.868V30zm-3.062-7.298h-.064c-.419-.5-1.225-.951-2.239-.951-2.127 0-4.076 1.869-4.076 4.27 0 2.384 1.949 4.237 4.076 4.237 1.015 0 1.82-.451 2.239-.966h.064v.612c0 1.627-.87 2.497-2.271 2.497-1.144 0-1.853-.821-2.143-1.514l-1.627.677c.467 1.127 1.707 2.513 3.77 2.513 2.191 0 4.044-1.289 4.044-4.431V22.01h-1.772v.692zm-2.142 5.881c-1.289 0-2.368-1.08-2.368-2.562 0-1.499 1.079-2.594 2.368-2.594 1.272 0 2.271 1.095 2.271 2.594 0 1.482-.999 2.562-2.271 2.562zm24.381-11.084h-4.471V30H99.2v-4.736h2.605c2.068 0 4.102-1.497 4.102-3.882s-2.033-3.883-4.101-3.883zm.048 6.025H99.2v-4.285h2.654c1.395 0 2.187 1.155 2.187 2.143 0 .968-.792 2.142-2.187 2.142zm11.532-1.795c-1.351 0-2.75.595-3.329 1.914l1.656.691c.354-.691 1.014-.917 1.705-.917.965 0 1.946.579 1.962 1.608v.129c-.338-.193-1.062-.482-1.946-.482-1.785 0-3.603.981-3.603 2.814 0 1.673 1.464 2.75 3.104 2.75 1.254 0 1.946-.563 2.38-1.223h.064v.965h1.802v-4.793c.001-2.218-1.657-3.456-3.795-3.456zm-.226 6.851c-.61 0-1.463-.306-1.463-1.062 0-.965 1.062-1.335 1.979-1.335.819 0 1.206.177 1.704.418a2.262 2.262 0 0 1-2.22 1.979zm10.583-6.578l-2.139 5.42h-.064l-2.22-5.42h-2.01l3.329 7.575-1.898 4.214h1.946l5.131-11.789h-2.075zM106.937 30h1.865V17.499h-1.865V30z" />
      <linearGradient id="a" gradientUnits="userSpaceOnUse" x1="21.801" y1="173.291" x2="5.019" y2="156.509" gradientTransform="matrix(1 0 0 -1 0 182)">
        <stop offset="0" stopColor="#00a0ff" />
        <stop offset=".007" stopColor="#00a1ff" />
        <stop offset=".26" stopColor="#00beff" />
        <stop offset=".512" stopColor="#00d2ff" />
        <stop offset=".76" stopColor="#00dfff" />
        <stop offset="1" stopColor="#00e3ff" />
      </linearGradient>
      <path fill="url(#a)" d="M10.436 7.538c-.291.308-.463.786-.463 1.405v22.116c0 .62.172 1.097.463 1.405l.074.072 12.389-12.389v-.292l-12.39-12.39-.073.073z" />
      <linearGradient id="b" gradientUnits="userSpaceOnUse" x1="33.834" y1="161.999" x2="9.638" y2="161.999" gradientTransform="matrix(1 0 0 -1 0 182)">
        <stop offset="0" stopColor="#ffe000" />
        <stop offset=".409" stopColor="#ffbd00" />
        <stop offset=".775" stopColor="orange" />
        <stop offset="1" stopColor="#ff9c00" />
      </linearGradient>
      <path fill="url(#b)" d="M27.028 24.278l-4.129-4.131v-.292l4.13-4.13.093.053 4.893 2.78c1.397.794 1.397 2.093 0 2.888l-4.893 2.78-.094.052z" />
      <linearGradient id="c" gradientUnits="userSpaceOnUse" x1="24.828" y1="159.705" x2="2.07" y2="136.947" gradientTransform="matrix(1 0 0 -1 0 182)">
        <stop offset="0" stopColor="#ff3a44" />
        <stop offset="1" stopColor="#c31162" />
      </linearGradient>
      <path fill="url(#c)" d="M27.122 24.225l-4.224-4.224-12.462 12.463c.46.488 1.221.548 2.078.062l14.608-8.301" />
      <linearGradient id="d" gradientUnits="userSpaceOnUse" x1="7.297" y1="181.823" x2="17.46" y2="171.661" gradientTransform="matrix(1 0 0 -1 0 182)">
        <stop offset="0" stopColor="#32a071" />
        <stop offset=".069" stopColor="#2da771" />
        <stop offset=".476" stopColor="#15cf74" />
        <stop offset=".801" stopColor="#06e775" />
        <stop offset="1" stopColor="#00f076" />
      </linearGradient>
      <path fill="url(#d)" d="M27.122 15.777l-14.608-8.3c-.857-.487-1.618-.426-2.078.062l12.463 12.463 4.223-4.225z" />
      <path opacity=".2" d="M27.029 24.132L12.514 32.38c-.812.461-1.538.43-2.004.011l-.074.074.074.072c.466.42 1.192.451 2.004-.011l14.608-8.3-.093-.094z" />
      <path opacity=".12" d="M10.436 32.318c-.291-.308-.463-.786-.463-1.405v.146c0 .619.172 1.097.463 1.405l.074-.074-.074-.072zM32.015 21.299l-4.986 2.833.093.093 4.893-2.78c.699-.397 1.048-.92 1.048-1.443-.059.473-.415.936-1.048 1.297z" />
      <path opacity=".25" fill="#FFF" d="M12.514 7.623l19.501 11.08c.634.36.989.824 1.048 1.298 0-.523-.349-1.047-1.048-1.444L12.514 7.477c-1.398-.794-2.541-.134-2.541 1.466v.146c0-1.6 1.143-2.26 2.541-1.466z" />
    </svg>
  </a>
);

export default AppStoreButton;



// WEBPACK FOOTER //
// ./src/js/app/components/buttons/PlayStoreButton.js