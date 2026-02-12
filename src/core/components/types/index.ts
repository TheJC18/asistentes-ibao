// Tipos e interfaces de UI para componentes (migrados desde types global)
export interface UserCardProps {
	user: {
		id: string;
		uid?: string;
		name?: string;
		displayName?: string;
		email?: string;
		avatar?: string;
		photoURL?: string;
		birthdate?: string | Date;
		age?: number | string;
		phone?: string;
		type?: string;
		relation?: string;
		gender?: string;
		nationality?: string;
		isMember?: boolean;
		hasWebAccess?: boolean;
	};
	showRelation?: boolean;
	showPhone?: boolean;
	showNationality?: boolean;
}

export interface UserDropdownProps {
	displayName: string;
	email: string;
	photoURL: string;
	role: string;
	uid: string;
}

export interface CalendarEvent {
	id: string | number;
	title: string;
	date: string | Date;
	type?: string;
	color?: string;
	allDay?: boolean;
}
export interface CalendarProps {
	events?: CalendarEvent[];
	birthdays?: UserBirthday[];
	onDateClick?: (date: Date) => void;
	onEventClick?: (event: CalendarEvent) => void;
	className?: string;
	readOnly?: boolean;
	disableNavigation?: boolean;
}
export interface UserBirthday {
	uid: string;
	name: string;
	birthdate: string;
}
export interface CalendarGridProps {
	currentDate: Date;
	events?: CalendarEvent[];
	onDateClick?: (date: Date) => void;
	onEventClick?: (event: CalendarEvent) => void;
	readOnly?: boolean;
}
export interface DayCell {
	date: Date;
	isCurrentMonth: boolean;
}

export interface ColumnConfig<T> {
	key: keyof T | string;
	label: string;
	visibleOn?: Array<"base" | "2xs" | "xs" | "ss" | "sm" | "md" | "lg" | "xl">;
	render?: (item: T) => React.ReactNode;
	className?: string;
	[key: string]: any;
}
export interface TableDefaultProps<T> {
	data: T[];
	columns: ColumnConfig<T>[];
	actions?: (item: T) => React.ReactNode;
	className?: string;
}
export interface EntityListProps<T> {
	title: React.ReactNode;
	description?: string;
	data?: T[];
	columns?: ColumnConfig<T>[];
	renderActions?: (item: T) => React.ReactNode;
	filterFunction?: (item: T, search: string) => boolean;
	perPageOptions?: number[];
	defaultPerPage?: number;
	searchPlaceholder?: string;
	onSearchChange?: (search: string) => void;
	FloatingButton?: React.ReactNode;
	ModalComponent?: React.ReactNode;
	isLoading?: boolean;
	error?: string | null;
	onRetry?: () => void;
	noDataMessage?: string;
}
export interface PaginationProps {
	page: number;
	totalPages: number;
	onPrev: () => void;
	onNext: () => void;
	perPage: number;
	setPerPage: (n: number) => void;
	perPageOptions?: number[];
	perPageLabel?: string;
}

export type BadgeVariant = "light" | "solid";
export type BadgeSize = "sm" | "md";
export type BadgeColor =
	| "primary"
	| "success"
	| "error"
	| "warning"
	| "info"
	| "light"
	| "dark";
export interface BadgeProps {
	variant?: BadgeVariant;
	size?: BadgeSize;
	color?: BadgeColor;
	startIcon?: React.ReactNode;
	endIcon?: React.ReactNode;
	children: React.ReactNode;
}

export interface AvatarProps {
	src: string;
	alt?: string;
	size?: "xsmall" | "small" | "medium" | "large" | "xlarge" | "xxlarge";
	status?: "online" | "offline" | "busy" | "none";
}

export interface ButtonProps {
	children: React.ReactNode;
	size?: "sm" | "md";
	variant?: "primary" | "outline";
	startIcon?: React.ReactNode;
	endIcon?: React.ReactNode;
	onClick?: () => void;
	disabled?: boolean;
	className?: string;
	type?: "button" | "submit" | "reset" ;
}

export interface DropdownProps {
	isOpen: boolean;
	onClose: () => void;
	children: React.ReactNode;
	className?: string;
}
export interface DropdownItemProps {
	tag?: "a" | "button";
	to?: string;
	onClick?: () => void;
	onItemClick?: () => void;
	baseClassName?: string;
	className?: string;
	children: React.ReactNode;
}

import { IconProp } from '@fortawesome/fontawesome-svg-core';
export interface FloatingActionButton {
	icon: IconProp;
	onClick: () => void;
	title: string;
	color?: 'blue' | 'green' | 'red' | 'purple' | 'pink' | 'yellow';
	tooltip?: string;
}
export interface FloatingActionButtonsProps {
	buttons: FloatingActionButton[];
}
