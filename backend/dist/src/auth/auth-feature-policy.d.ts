import { AuthenticatedFeatureDto, AuthenticatedUserDto, InternalFeatureKey, SessionAccessLevel } from './auth.types';
export declare function buildFeatureCatalog(user: AuthenticatedUserDto, accessLevel: SessionAccessLevel, disabledFeatures: Set<InternalFeatureKey>): AuthenticatedFeatureDto[];
export declare function parseDisabledFeaturesFromEnvironment(rawValue?: string | undefined): Set<InternalFeatureKey>;
