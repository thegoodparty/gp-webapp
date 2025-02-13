// 'use client';

// import H4 from '@shared/typography/H4';
// import Body2 from '@shared/typography/Body2';
// import { LuHeartHandshake } from 'react-icons/lu';
// import Invitation from './Invitation';
// import Paper from '@shared/utils/Paper';
// import H2 from '@shared/typography/H2';

// function InvitationSection(props) {
//   const { invitations } = props;
//   if (!invitations || invitations.length === 0) {
//     return null;
//   }

//   return (
//     <Paper className="mt-4">
//       <H2>Invitations</H2>
//       <Body2 className="text-gray-600 mb-8">
//         Join the movement: Your Invitation Awaits!
//       </Body2>

//       <div className="grid grid-cols-12 gap-4 mt-8">
//         {invitations.map((invitation) => (
//           <div key={invitation.id} className="col-span-12 md:col-span-6">
//             <Invitation invitation={invitation} />
//           </div>
//         ))}
//       </div>
//     </Paper>
//   );
// }

// export default InvitationSection;
