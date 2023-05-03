
/**
 * Impact of failure options
 */

 export enum IMPACT_OF_FAILURE_ENUM {
    TOTAL_LOSS_OF_FUNCTION = 'Total Loss Of Function',
    REDUCTION_OF_SYSTEM_FUNCTIONALITY = 'Reduction of System Functionality',
    REDUCTION_OF_PARTS_FUNCTIONALITY = 'Reduction of Parts Functionality',
    HARDLY_ANY_EFFECTS = 'Hardly any Effect'
}

/**
 * Possibility of failure options
 */

export enum POSSIBILITY_OF_FAILURE_ENUM {
    HIGH = "High",
    MEDIUM = "Medium",
    LOW = "Low",
    MINIMAL = "Minimal",
}


/**
 * Mitigation Options
 */

export enum MITIGATION_ENUM {
    REACTIVE = "Reactive",
    INSPECTION = "Inspection",
    PREVENTIVE = "Preventive"
}

/**
 * Responsible person options
 */


export enum RESPONSIBLE_ENUM {
    CARETAKER = "Caretaker",
    TECHNICIAN = "Technician",
    OTHERS = "Others"
}

/**
 * Parameters types options
 */


export enum PARAMETER_TYPES_ENUM {
    CHEMICAL = "Chemical",
    PHYSICAL = "Physical",
    OTHERS = "Others", 
}
