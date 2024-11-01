'use client';
import PortalPanel from '@shared/layouts/PortalPanel';
import AdminWrapper from 'app/admin/shared/AdminWrapper';
import Tooltip from '@mui/material/Tooltip';
import Table from '@shared/utils/Table';
import { useMemo, useState } from 'react';
import { formatToPhone } from 'helpers/numberHelper';
import { dateUsHelper, dateWithTime } from 'helpers/dateHelper';
import Actions from './Actions';
import Button from '@shared/buttons/Button';
import Modal from '@shared/utils/Modal';
import H2 from '@shared/typography/H2';
import TextField from '@shared/inputs/TextField';
import { MenuItem, Select } from '@mui/material';
import { USER_ROLES } from 'helpers/userHelper';
import { ModalFooter } from '@shared/ModalFooter';
import { isValidEmail } from 'helpers/validations';
import gpFetch from 'gpApi/gpFetch';
import { useSnackbar } from 'helpers/useSnackbar';
import gpApi from 'gpApi';

const buildTableInputData = (users) =>
  users.map((user) => {
    const metaData = (user.metaData && JSON.parse(user.metaData)) || {};
    const userType = user.isAdmin
      ? 'admin'
      : user.candidate
      ? 'candidate'
      : user.role || 'user';

    return {
      ...user,
      userType,
      lastVisited: metaData?.lastVisited && new Date(metaData?.lastVisited),
      createdAt: user.createdAt && new Date(user.createdAt),
      campaigns: user.campaigns || [],
    };
  });

export default function AdminUsersPage(props) {
  const users = props.users || [];
  const { defaultFilters = [] } = props;
  const inputData = buildTableInputData(users);

  const data = useMemo(() => inputData);

  let columns = useMemo(() => [
    {
      Header: 'Actions',
      collapse: true,
      accessor: 'actions',
      Cell: ({ row }) => {
        return <Actions {...row.original} />;
      },
    },

    {
      Header: 'Name',
      accessor: 'name',
      Cell: ({ row }) => {
        return (
          <>
            {row.original.firstName} {row.original.lastName}
          </>
        );
      },
    },

    {
      Header: 'Email',
      accessor: 'email',

      Cell: ({ row }) => (
        <Tooltip title={row.original.email}>
          <a href={`mailto:${row.original.email}`}>{row.original.email}</a>
        </Tooltip>
      ),
    },
    {
      Header: 'Campaign Role(s)',
      accessor: 'campaigns',
      Cell: ({ row }) => {
        return (
          Boolean(row.original.campaigns?.length) &&
          row.original.campaigns.map((campaign) => (
            <a
              key={campaign.id}
              className="underline"
              href={`/admin/campaign-statistics?id=${campaign.id}`}
            >
              {campaign.slug} -{' '}
              <span className="capitalize">{campaign.role}</span>
            </a>
          ))
        );
      },
    },
    {
      Header: 'Last Visit',
      accessor: 'lastVisited',
      sortType: 'datetime',
      Cell: ({ row }) => {
        return row.original.lastVisited &&
          row.original.lastVisited?.toString() !== 'Invalid Date'
          ? dateWithTime(row.original.lastVisited)
          : 'n/a';
      },
    },

    {
      Header: 'Date Created',
      accessor: 'createdAt',
      sortType: 'datetime',
      Cell: ({ row }) => {
        return row.original.createdAt?.toString() !== 'Invalid Date'
          ? dateUsHelper(row.original.createdAt)
          : 'n/a';
      },
    },

    {
      Header: 'Phone',
      accessor: 'phone',

      Cell: ({ row }) => (
        <Tooltip title={row.original.phone}>
          <a href={`tel:${row.original.phone}`}>
            {formatToPhone(row.original.phone)}
          </a>
        </Tooltip>
      ),
    },

    {
      Header: 'Zip',
      accessor: 'zip',
    },

    {
      Header: 'User Type',
      accessor: 'userType',

      collapse: true,
    },
    {
      accessor: 'id',
      hide: true,
    },
  ]);

  return (
    <AdminWrapper {...props}>
      <PortalPanel color="#2CCDB0">
        <div className="flex flex-col items-end">
          <AddUserButton />
        </div>
        <Table
          data={data}
          columns={columns}
          defaultPageSize={25}
          defaultFilters={defaultFilters}
          showPagination
          filterable
        />
      </PortalPanel>
    </AdminWrapper>
  );
}

const createNewUser = async ({ firstName, lastName, email, role }) => {
  try {
    const user = await gpFetch(gpApi.admin.createUser, {
      firstName,
      lastName,
      email,
      role,
    });
    console.log(`user =>`, user);
    if (user) {
      return user;
    }
    return false;
  } catch (e) {
    console.log('error', e);
    return false;
  }
};

const AddUserButton = ({ onClick = () => {} }) => {
  const { successSnackbar, errorSnackbar } = useSnackbar();
  const [modalOpen, setModalOpen] = useState(false);
  const [role, setRole] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');

  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);

  const handleOnClick = () => {
    openModal();
    onClick();
  };

  const handleSubmit = async () => {
    const newUser = await createNewUser({
      firstName,
      lastName,
      email,
      role,
    });
    if (!newUser) {
      errorSnackbar('Error creating new user');
      return;
    }
    successSnackbar('User created successfully');
    closeModal();
    window.location.reload();
  };

  const emailIsValid = email !== '' && isValidEmail(email);

  const formValid =
    emailIsValid && role !== '' && firstName !== '' && lastName !== '';

  return (
    <>
      <Button
        {...{
          onClick: handleOnClick,
          color: 'success',
        }}
      >
        Add User
      </Button>
      <Modal
        {...{
          boxClassName: 'w-[95vw] md:w-auto',
          open: modalOpen,
          closeCallback: () => setModalOpen(false),
        }}
      >
        <H2 className="text-center mb-4">Add User</H2>
        <div className="grid grid-cols-1 gap-4 mb-4 md:grid-cols-2">
          <TextField
            {...{
              className: 'w-full',
              label: 'First Name',
              onChange: (e) => setFirstName(e.target.value),
            }}
          />
          <TextField
            {...{
              className: 'w-full',
              label: 'Last Name',
              onChange: (e) => setLastName(e.target.value),
            }}
          />
        </div>
        <TextField
          {...{
            className: 'w-full mb-2',
            label: 'Email',
            onChange: (e) => {
              setEmail(e.target.value);
            },
          }}
        ></TextField>
        <Select
          {...{
            className: 'w-full',
            value: role,
            displayEmpty: true,
            onChange: (e) => setRole(e.target.value),
            InputProps: {
              className: 'capitalize',
            },
          }}
        >
          <MenuItem value="">Select</MenuItem>
          {Object.values(USER_ROLES).map((role) => (
            <MenuItem className="capitalize" value={role} key={role}>
              <span className="capitalize">{role}</span>
            </MenuItem>
          ))}
        </Select>
        <ModalFooter
          {...{
            onBack: closeModal,
            onNext: handleSubmit,
            disabled: !formValid,
            nextText: 'Add User',
            backText: 'Cancel',
          }}
        />
      </Modal>
    </>
  );
};
