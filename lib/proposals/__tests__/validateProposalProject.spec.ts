import { InvalidInputError } from '@charmverse/core/errors';

import { defaultProjectAndMembersFieldConfig, defaultProjectAndMembersPayload } from 'lib/projects/constants';
import { createProject } from 'lib/projects/createProject';
import { generateUserAndSpaceWithApiToken } from 'testing/setupDatabase';

import { validateProposalProject } from '../validateProposalProject';

describe('validateProposalProject', () => {
  it('Should throw error if proposal project information is not valid', async () => {
    const { user } = await generateUserAndSpaceWithApiToken();
    const createdProject = await createProject({
      userId: user.id,
      project: defaultProjectAndMembersPayload
    });

    await expect(
      validateProposalProject({
        projectId: createdProject.id,
        formFields: [
          {
            type: 'project_profile',
            fieldConfig: {
              ...defaultProjectAndMembersFieldConfig,
              name: {
                required: true
              }
            }
          }
        ]
      })
    ).rejects.toBeInstanceOf(InvalidInputError);
  });

  it('Should not throw error if proposal project information is valid', async () => {
    const { user } = await generateUserAndSpaceWithApiToken();
    const createdProject = await createProject({
      userId: user.id,
      project: {
        ...defaultProjectAndMembersPayload,
        name: 'Test Project',
        projectMembers: [
          {
            ...defaultProjectAndMembersPayload.projectMembers[0],
            name: 'Test User'
          }
        ]
      }
    });

    await expect(
      validateProposalProject({
        defaultRequired: false,
        projectId: createdProject.id,
        formFields: [
          {
            type: 'project_profile',
            fieldConfig: {
              ...defaultProjectAndMembersFieldConfig,
              name: {
                required: true
              }
            }
          }
        ]
      })
    ).resolves.toBeUndefined();
  });
});
